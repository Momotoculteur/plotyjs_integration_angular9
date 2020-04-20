import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface row {
    date: Date;
    confirmed: number;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public nbEntree: number;
    public allData: any[];
    public layout: object;
    public config: object;

    constructor(
        private http: HttpClient,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        
        this.nbEntree = 0;
        this.allData = [];
        this.allData.push({
            type: 'bar',
            x: [],
            y: [],
            marker: {
                color: 'red'
            },
            name: 'Décés',
            legendgroup: '0',
        });     
        this.allData.push({
            type: 'bar',
            x: [],
            y: [],
            marker: {
                color: 'green'
            },
            name: 'Soignés',
            legendgroup: '1',
        });    
        this.layout = {
            title: 'Evolution du Covid19 En France',
            barmode: 'group',
            autosize: true,
            bargroupgap: 0.9,
        };
        this.config = {
            responsive: true
        };

        this.loadData();
    }


    private loadData(): void {
        this.http.get('assets/data.csv', { responseType: 'text' })
            .subscribe(data => {
                this.parseXmlFile(data);
            });
    }


    private parseXmlFile(csvContent: string): void {
        const csvContentByLine = csvContent.split('\n');

        let xTempDate: object[] = [];

        let yTempHealed: number[] = [];
        let yTempDeath: number[] = [];

        csvContentByLine.forEach((csvLine) => {
            // Verif ligne non vide, inséré par Pandas
            if (csvLine.length && csvLine !== '') {
                const currentLine = csvLine.split(',');
                if (this.nbEntree === 0) {
                } else {
                    if(currentLine[1] === 'PAYS') {
                        xTempDate.push(new Date(currentLine[0]));
                        yTempDeath.push(Number(currentLine[4]));
                        yTempHealed.push(Number(currentLine[8]));
                    }
                    
                }
                this.nbEntree++;
            }
        });

        this.allData[0].x = xTempDate;
        this.allData[0].y = yTempDeath;

        this.allData[1].x = xTempDate;
        this.allData[1].y = yTempHealed;
    }
}
