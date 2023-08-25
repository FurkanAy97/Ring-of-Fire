import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  items$: Observable<any> | undefined;
  pickCardAnimation = false;
  currentCard: string = '';
  game: any;
  collectionData$: any;
  unsubSingle: any;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    const aCollection = collection(this.firestore, 'game');
    collectionData(aCollection).subscribe((val) => {
      /* console.log(val); */
    });
  }

  ngOnInit(): void {
    this.newGame();
    console.log(this.game);
    this.route.params.subscribe((params) => {
      let collRef = collection(this.firestore, 'game');
      this.unsubSingle = onSnapshot(
        doc(collRef, params['id']),
        (element) => {
          let gameData: any = element.data();
          this.game.currentPlayer = gameData['game']['currentPlayer'];
          this.game.playedCards = gameData['game']['playedCards'];
          this.game.players = gameData['game']['players'];
          this.game.stack = gameData['game']['stack'];
        }
      );
    });
  }

  newGame(): void {
    this.game = new Game();
  }

  pickCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      console.log(this.currentCard);
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        this.pickCardAnimation = false;
        this.game.playedCards.push(this.currentCard);
      }, 1000);
    }
    console.log(this.game);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }
}
