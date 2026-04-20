export class Installation {
  static get VERSION() {
    return '0.14.12'; // From core package.json
  }

  static get USER_AGENT() {
    return `hopcode/${this.VERSION}`;
  }

  static get Path() {
    return {
      pkg: './',
    };
  }
}
