import type { SpotifyResponse } from './types';

type AccessToken = string;
type RefreshToken = string;

type SuccessfulGrantResponse = {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
};

export interface ISpotifyService {
  getNewAccessTokenFromRefreshToken: () => Promise<void>;
  exchangeCodeForAccessAndRefreshToken: (
    code: string,
  ) => Promise<SuccessfulGrantResponse>;
  getCurrentlyPlayingSong: () => Promise<SpotifyResponse>;
}

export class SpotifyErrorNoPlaying extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SpotifyErrorNoPlaying';
  }
}

export class SpotifyService implements ISpotifyService {
  /**
   * We're going to need a refresh token and we're going to need to
   * hard code it into our application.
   */
  private clientId: string = import.meta.env.SPOTIFY_CLIENT_ID as string;
  private clientSecret: string = import.meta.env
    .SPOTIFY_CLIENT_SECRET as string;
  private redirectUrl: string = import.meta.env.SPOTIFY_REDIRECT_URL as string;
  private refreshToken: RefreshToken = import.meta.env
    .SPOTIFY_REFRESH_TOKEN as string;
  private currentAccessToken: AccessToken = '';

  private setCurrentAccessToken(token: AccessToken): void {
    this.currentAccessToken = token;
  }

  private setRefreshToken(token: RefreshToken): void {
    this.refreshToken = token;
  }

  private hasAccessToken(): boolean {
    return this.currentAccessToken !== '';
  }

  public async exchangeCodeForAccessAndRefreshToken(
    code: string,
  ): Promise<SuccessfulGrantResponse> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUrl,
    });

    const response: { access_token: string; refresh_token: string } = await (
      await fetch(
        `https://accounts.spotify.com/api/token?${params.toString()}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
    ).json();

    this.setCurrentAccessToken(response.access_token);
    this.setRefreshToken(response.refresh_token);

    return {
      accessToken: this.currentAccessToken,
      refreshToken: this.refreshToken,
    };
  }

  public async getNewAccessTokenFromRefreshToken(): Promise<void> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken,
    });

    const response: { access_token: string } = await (
      await fetch(
        `https://accounts.spotify.com/api/token?${params.toString()}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
    ).json();

    this.setCurrentAccessToken(response.access_token);
  }

  private fetchCurrentlyPlayingSong(): Promise<Response> {
    return fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${this.currentAccessToken}`,
      },
    });
  }

  public async getCurrentlyPlayingSong(): Promise<SpotifyResponse> {
    if (!this.hasAccessToken()) {
      await this.getNewAccessTokenFromRefreshToken();
    }

    let response = await this.fetchCurrentlyPlayingSong();

    if (!response.ok) {
      await this.getNewAccessTokenFromRefreshToken();
      response = await this.fetchCurrentlyPlayingSong();
    }

    const data = await response.json();
    const isSongPlaying = !!data.item;

    if (!isSongPlaying) {
      throw new SpotifyErrorNoPlaying('No song playing');
    }

    return data;
  }
}
