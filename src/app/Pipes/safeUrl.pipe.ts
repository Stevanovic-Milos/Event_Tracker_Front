//ovo je pipe ista stvar kao date ili slice samo smo ovaj mi rucno krirli da bi mogli da g akoristim po potrebi
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }
    //pretvaramo nas url u safeUrl odnosno overrajdujemo angularovu konfiguraciju da ne dozvoljava eksterne linkove direkrno ucitane u elemnte
    transform(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}