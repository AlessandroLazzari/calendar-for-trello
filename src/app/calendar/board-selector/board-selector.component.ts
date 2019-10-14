import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {select} from '@angular-redux/store';
import {Board} from '../../models/board';
import {Observable} from 'rxjs';
import {SettingsActions} from '../../redux/actions/settings-actions';
import {Settings} from '../../models/settings';
import {MemberMap} from '../../redux/reducers/member.reducer';
import {FormControl} from '@angular/forms';
import {componentDestroyed, untilComponentDestroyed} from 'ng2-rx-componentdestroyed';
import {selectVisibleBoards, selectBoards} from '../../redux/store/selects';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-board-selector',
  templateUrl: './board-selector.component.html',
  styleUrls: ['./board-selector.component.scss']
})
export class BoardSelectorComponent implements OnInit, OnDestroy {

  @select(selectVisibleBoards) public boards$: Observable<Board[]>;
  public selectOptions$: Observable<Board[]>;
  @select('settings') public settings$: Observable<Settings>;
  boardCtrl = new FormControl(null);

  constructor(private settingsActions: SettingsActions) {
    this.selectOptions$ = this.boards$;
  }

  @HostBinding('class.active') get isActive() {
    return this.boardCtrl.value !== null;
  }

  ngOnInit() {

    this.settings$
      .pipe(untilComponentDestroyed(this))
      .subscribe((settings: Settings) => this.boardCtrl.patchValue(settings.filterForBoard, {
        onlySelf: true,
        emitEvent: false
      }));

    this.boardCtrl.valueChanges
      .pipe(untilComponentDestroyed(this))
      .subscribe((res: string) => this.update(res));
  }

  update(boardId: string) {
    this.settingsActions.setFilterForBoard(boardId);
  }

  ngOnDestroy() {
  }
}
