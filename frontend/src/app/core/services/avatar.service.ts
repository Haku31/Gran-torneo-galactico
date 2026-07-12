import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AvatarService {
  private readonly styles = ['bottts', 'bottts-neutral', 'rings', 'shapes', 'identicon', 'lorelei-neutral'];

  getUrl(species: { id: number; name: string }): string {
    const style = this.styles[species.id % this.styles.length];
    const seed = encodeURIComponent(species.name);
    return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&backgroundColor=0a0a2e,0d0d3b,transparent`;
  }
}
