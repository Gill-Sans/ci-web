import {ActivatedRouteSnapshot, Route, RouterStateSnapshot, Routes} from '@angular/router';
import {SessionsOverviewComponent} from './feature/sessions/sessions-overview/sessions-overview.component';
import {WelcomeComponent} from './feature/public/welcome/welcome.component';
import {AuthGuardData, createAuthGuard} from 'keycloak-angular';
import {PlatformLayoutComponent} from './feature/layouts/platform-layout/platform-layout.component';

const isUserAuthenticated = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot, authData: AuthGuardData) => {
   const { authenticated } = authData;
   return authenticated;
};

const isUserAdmin = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot, authData: AuthGuardData) => {
    const { authenticated, grantedRoles } = authData;
    return authenticated && grantedRoles.realmRoles.includes('admin');
};

export const routes: Routes = [
    { path: "", component: WelcomeComponent },
    {
        path: "platform",
        component: PlatformLayoutComponent,
        canActivate: [createAuthGuard(isUserAuthenticated)],
        children: [
            { path: "sessions", component: SessionsOverviewComponent }
        ]
    }
];
