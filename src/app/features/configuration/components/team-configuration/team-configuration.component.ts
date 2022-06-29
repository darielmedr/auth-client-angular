import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, BehaviorSubject, Observable, delay, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { TeamMember } from 'src/app/features/configuration/models/team-member.model';
import { TeamService } from 'src/app/features/configuration/services/team.service';

@Component({
  selector: 'app-team-configuration',
  templateUrl: './team-configuration.component.html',
  styleUrls: ['./team-configuration.component.scss']
})
export class TeamConfigurationComponent implements OnInit, AfterViewInit, OnDestroy {

  public unsubscribe$: Subject<void> = new Subject<void>();

  public loadingSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = new Observable();

  public dataSource: MatTableDataSource<TeamMember> = new MatTableDataSource<TeamMember>();

  public columnsToDisplay: string[] = ['name', 'email', 'status', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public filterForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private teamService: TeamService
  ) { }

  ngOnInit(): void {
    this.loadingSubject$.next(true);

    this.initForms();
    this.applyFilter();
    this.loadDataSource();

    /**
     * Waits 300ms before showing the loading animation
     */
    this.isLoading$ = this.loadingSubject$.asObservable().pipe(delay(300));
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initForms(): void {
    this.filterForm = this.fb.group({
      filter: ['']
    });
  }

  private applyFilter(): void {
    this.filterForm.get('filter')?.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((filterValue => {
        if (!this.dataSource) return;

        this.dataSource.filter = filterValue.trim().toLowerCase();
      }));
  }

  private loadDataSource(): void {
    // this.teamService.getEmployees()
    //   .pipe(
    //     takeUntil(this.unsubscribe$)
    //   )
    //   .subscribe((data: TeamMember[]) => {
    //     this.loadingSubject$.next(false);
    //     this.dataSource.data = data;
    //   });

    this.loadingSubject$.next(false);
    this.dataSource.data = [
      {
        id: 'k94jf81ads8f',
        name: 'John Doe',
        email: 'johndoe@domain.com',
        status: 'Pending'
      },
      {
        id: 'a3dqrw4i48n1',
        name: 'Super Admin',
        email: 'superadmin@domain.com',
        status: 'Joined'
      }
    ];
  }

  public deleteMember(id: string): void {
    // this.teamService.deleteEmployee(id)
    //   .then(() => this.alertService.showMessage('The supplier was deleted successfully'))
    //   .catch((err) => this.alertService.showMessage('Error.' + err));
  }
}
