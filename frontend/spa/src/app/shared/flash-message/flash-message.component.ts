import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
    selector: 'app-flash-message',
    standalone: false,
    templateUrl: './flash-message.component.html',
    styleUrls: ['./flash-message.component.scss'],
})
export class FlashMessageComponent implements OnInit {
    @Input() message: string = '';
    @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';
    @Input() position: 'top-right' | 'middle-right' | 'bottom-right' = 'top-right';
    @Input() maxWidth: string = '80%';
    @Input() duration: number = 3000; // Tiempo de visualización por defecto

    constructor(
        public dialogRef: MatDialogRef<FlashMessageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        if (this.data) {
            this.message = this.data.message;
            this.type = this.data.type;
            this.position = this.data.position;
            this.maxWidth = this.data.maxWidth;
            this.duration = this.data.duration;
        }
    }

    getCssClass() {
        return {
            'flash-message-success': this.type === 'success',
            'flash-message-error': this.type === 'error',
            'flash-message-info': this.type === 'info',
            'flash-message-warning': this.type === 'warning',
        };
    }

    getPositionStyle() {
        const positions = {
            'top-right': { top: '20px', right: '20px' },
            'middle-right': { top: '50%', right: '20px', transform: 'translateY(-50%)' },
            'bottom-right': { bottom: '20px', right: '20px' }
        };
        return {
            ...positions[this.position],
            maxWidth: this.maxWidth
        };
    }

    getIcon() {
        switch (this.type) {
            case 'success':
                return 'check_circle';
            case 'error':
                return 'error';
            case 'info':
                return 'info';
            case 'warning':
                return 'warning';
            default:
                return 'info';
        }
    }
}
