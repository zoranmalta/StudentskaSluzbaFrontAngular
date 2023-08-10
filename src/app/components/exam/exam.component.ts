import { Component, OnInit, ViewChild } from '@angular/core';
import { Exam } from 'src/app/model/exam';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MyErrorStateMatcher } from 'src/app/error-validators/MyErrorStateMatcher';
import { Course } from 'src/app/model/course';
import { CourseService } from 'src/app/services/course.service';
import { ExamService } from 'src/app/services/exam.service';

@Component({
	selector: 'app-exam',
	templateUrl: './exam.component.html',
	styleUrls: ['./exam.component.css'],
})
export class ExamComponent implements OnInit {
	examList: Exam[] = [];
	courses: Course[] = [];
	dataSource: any;
	displayedColumns: string[] = ['id', 'period', 'courseName', 'examStart', 'archived', 'details'];
	matcher = new MyErrorStateMatcher();
	showInsertExam: boolean = false;

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild(MatTable, { static: true }) table: MatTable<any>;

	examForm = this.formBuilder.group({
		id: [''],
		period: ['', Validators.required],
		courseId: ['', Validators.required],
		examStart: ['', Validators.required],
	});

	constructor(private formBuilder: FormBuilder, private courseService: CourseService, private examService: ExamService, public dialog: MatDialog, private snackBar: MatSnackBar) {}

	ngOnInit(): void {
		this.examService.getExams().subscribe(
			(data) => {
				console.log('Lista ispita success: ' + data);
				this.examList = data;
				//objekat koji prima listu i omogucuje sort pag i ostale stvari
				this.dataSource = new MatTableDataSource(this.examList);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			},
			(error) => {
				console.log('error u listi staff' + error);
			}
		);
	}

	onSubmitExam(examForm: any) {
		let examForInsert = new Exam();
		examForInsert.period = examForm.period;
		examForInsert.examStart = examForm?.examStart;
		examForInsert.course = this.courses.filter((course) => {
			return course.id == examForm.courseId;
		})[0];
		console.log('exam koji saljem : ' + examForInsert.period + ' ' + examForInsert?.examStart + ' ' + examForInsert.course.name);
		this.examService.insertExam(examForInsert).subscribe(
			(data) => {
				this.examList.push(data);
				this.dataSource.data = this.examList;
				this.table.renderRows();
				this.onClear();
				this.onCancel();
				this.snackBar.open(`Exam ${data.course.name}  is created`, '', { duration: 2500 });
			},
			(error) => {
				console.log('greska pri insertu exam');
				this.onClear();
				//this.snackBar.open(`Exam is not created`,"",{duration:2500})
			}
		);
	}

	onUpdate(examForm: any) {}

	details(exam: Exam) {}

	onClear() {
		this.examForm.reset();
	}

	onCancel() {
		this.showInsertExam = false;
	}

	getRowData(row) {}

	onAddExam() {
		this.showInsertExam = true;
		this.courseService.getCourses().subscribe(
			(data) => {
				this.courses = data.filter((course) => {
					return course.deleted == false;
				});
			},
			(error) => console.log('Greska pri ucitavanju liste courses')
		);
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}
}
