import { Injectable } from '@angular/core';


@Injectable()
export class ColorService {
  public readonly light = {
    teal: '#1ABC9C',
    green: '#2ECC71',
    blue: '#3498DB',
    purple: '#9B59B6',
    yellow: '#F1C40F',
    orange: '#E67E22',
    red: '#E74C3C',
    silver: '#ECF0F1',
    gray: '#95A5A6',
    black: '#34495E',
  };
  public readonly dark = {
    teal: '#16A085',
    green: '#27AE60',
    blue: '#2980B9',
    purple: '#8E44AD',
    yellow: '#F39C12',
    orange: '#D35400',
    red: '#C0392B',
    silver: '#BDC3C7',
    gray: '#7F8C8D',
    black: '#2C3E50',
  };
  constructor() { }
}
