import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import {
  CollectionReference,
  DocumentData,
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
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent {
  private gameCollection: CollectionReference<DocumentData>;
  public game: any

  constructor(private readonly firestore: Firestore, private router: Router) {
    this.gameCollection = collection(this.firestore, 'game');
    console.log(this.gameCollection);
  }
  
  async newGame() {
    this.game = new Game();
    this.game = this.game.toJson();
    const gameInfo = await addDoc(this.gameCollection, this.game);
    console.log(gameInfo['id']);
    this.router.navigateByUrl('/game/' + gameInfo['id'])
  }
}
