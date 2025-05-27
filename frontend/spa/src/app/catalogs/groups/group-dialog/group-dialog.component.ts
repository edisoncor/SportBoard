import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Group, GroupValidators } from '../../../models/catalogs/group.model';
import { GroupService } from '../../../services/catalogs/group.service';

@Component({
    selector: 'app-group-dialog',
    templateUrl: './group-dialog.component.html',
    styleUrls: ['./group-dialog.component.scss'],
    standalone: false
})
export class GroupDialogComponent implements OnInit {
    groupForm: FormGroup;
    allGroupCodes: string[] = [];

    constructor(
        public dialogRef: MatDialogRef<GroupDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Group,
        private fb: FormBuilder,
        private groupService: GroupService
    ) {
        this.groupForm = this.fb.group({
            name: [data.name, GroupValidators.name],
            code: [data.code, GroupValidators.code],
            parentCode: [data.parentCode],
            description: [data.description],
            isActive: [data.isActive, GroupValidators.isActive],
            version: [data.version, GroupValidators.version]
        });
    }

    ngOnInit(): void {
        this.loadAllGroupCodes();
    }

    loadAllGroupCodes(): void {
        this.groupService.getAllGroups().subscribe((groups: Group[]) => {
            this.allGroupCodes = groups.map(group => group.code);
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
