import { Routes } from '@angular/router';
import {SessionsOverviewComponent} from './feature/sessions-overview/sessions-overview.component';

export const routes: Routes = [
  { path: "", component: SessionsOverviewComponent },
  { path: "sessions", component: SessionsOverviewComponent },
];
