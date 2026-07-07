import { Routes } from '@angular/router';
import { Interactions } from './pages/interactions/interactions';
import { Dashboard } from './pages/dashboard/dashboard';
import { Contacts } from './pages/contacts/contacts';
import { History } from './pages/history/history';
import { Knowledge } from './pages/knowledge/knowledge';
import { Settings } from './pages/settings/settings';
import { Profile } from './pages/profile/profile';

export const routes: Routes = [
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: 'inbox',
        component: Interactions
    },
    {
        path: 'contacts',
        component: Contacts
    },
    {
        path: 'history',
        component: History
    },
    {
        path: 'knowledge',
        component: Knowledge
    },
    {
        path: 'settings',
        component: Settings
    },
    {
        path: 'profile',
        component: Profile
    },
    {
        path:'',
        redirectTo: 'dashboard',
        pathMatch:'full'
    }
];
