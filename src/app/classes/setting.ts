export class Setting {

  public static default_settings = [
    new Setting('Fußgängerwege', 'highway', 'footway'),
    new Setting('Treppen', 'highway', 'steps'),
    new Setting('Pflasterstein', 'surface', 'cobblestone')
  ];

  public title: string;
  public key: string;
  public value: string;
  public use: boolean;
  public block: boolean;
  public rating: number;

  constructor(
    title: string, key: string, value: string,
    use?: boolean, block?: boolean, rating?: number) {
    this.title = title;
    this.key = key;
    this.value = value;
    this.use = use || false;
    this.block = block || false;
    this.rating = rating || 1.0;
  }
  
  public getUseKey(): string {
    return this.key + '_' + this.value + '_use';
  }
  public getBlockKey(): string {
    return this.key + '_' + this.value + '_block';
  }
  public getRatingKey(): string {
    return this.key + '_' + this.value + '_rating';
  }
}