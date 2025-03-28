import {ActivatedRouteSnapshot, Route, RouterStateSnapshot, Routes} from '@angular/router';
import {SessionsOverviewComponent} from './feature/sessions/sessions-overview/sessions-overview.component';
import {WelcomeComponent} from './feature/public/welcome/welcome.component';
import {AuthGuardData, createAuthGuard} from 'keycloak-angular';
import {PlatformLayoutComponent} from './feature/layouts/platform-layout/platform-layout.component';
import {PublicLayoutComponent} from './feature/layouts/public-layout/public-layout.component';
import {ConferenceCreateComponent} from './feature/conferences/conference-create/conference-create.component';
import {ConferenceOverviewComponent} from './feature/conferences/conference-overview/conference-overview.component';

const isUserAuthenticated = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot, authData: AuthGuardData) => {
   const { authenticated } = authData;
   return authenticated;
};

const isUserAdmin = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot, authData: AuthGuardData) => {
    const { authenticated, grantedRoles } = authData;
    return authenticated && grantedRoles.realmRoles.includes('admin');
};

export const routes: Routes = [
    {
        path: "",
        component: PublicLayoutComponent,
        children: [
            {path: "", component: WelcomeComponent},
        ]
    },
    {
        path: "platform",
        component: PlatformLayoutComponent,
        canActivate: [createAuthGuard(isUserAuthenticated)],
        children: [
            { path: "sessions", component: SessionsOverviewComponent },
            { path: "conferences", component: ConferenceOverviewComponent },
            { path: "conferences/create", component: ConferenceCreateComponent }
        ]
    }
];
