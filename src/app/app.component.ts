import { Component } from '@angular/core';
import { OsfService } from './services/osf.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AdtPluginAngular';

  constructor(private osf: OsfService) { }
}
