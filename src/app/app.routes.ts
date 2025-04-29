import {ActivatedRouteSnapshot, RouterStateSnapshot, Routes} from '@angular/router';
import {WelcomeComponent} from './feature/public/welcome/welcome.component';
import {AuthGuardData, createAuthGuard} from 'keycloak-angular';
import {PlatformLayoutComponent} from './feature/layouts/platform-layout/platform-layout.component';
import {PublicLayoutComponent} from './feature/layouts/public-layout/public-layout.component';
import {ConferenceCreateComponent} from './feature/conferences/conference-create/conference-create.component';
import {ConferenceOverviewComponent} from './feature/conferences/conference-overview/conference-overview.component';
import {ConferenceDetailsContainerComponent} from './feature/conferences/conference-details/conference-details-container/conference-details-container.component';
import {ProfileDetailsComponent} from './feature/profile/profile-details/profile-details.component';

const isUserAuthenticated = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot, authData: AuthGuardData) => {
    const {authenticated} = authData;
    return authenticated;
};

const isUserAdmin = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot, authData: AuthGuardData) => {
    const {authenticated, grantedRoles} = authData;
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
            {path: "conferences", component: ConferenceOverviewComponent},
            {path: "conferences/create", component: ConferenceCreateComponent},
            {path: "conferences/:id", component: ConferenceDetailsContainerComponent},
            {path: "profile", component: ProfileDetailsComponent}
        ]
    }
];
