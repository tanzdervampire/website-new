// @flow

import React from 'react';

import PageShowHead from './containers/pages/shows/PageShowHead';
import PageShowBody from './containers/pages/shows/PageShowBody';

import SvgIcon from 'material-ui/SvgIcon';
import IconHome from 'material-ui/svg-icons/action/home';
import IconPeople from 'material-ui/svg-icons/social/people';
import IconAccountBalance from 'material-ui/svg-icons/action/account-balance';
import IconFace from 'material-ui/svg-icons/action/face';
const IconGithub = (props) => (
    <SvgIcon viewBox="0 0 16 16" {...props}>
        <path d="M8 0C3.58 0 0 3.582 0 8c0 3.535 2.292 6.533 5.47 7.59.4.075.547-.172.547-.385 0-.19-.007-.693-.01-1.36-2.226.483-2.695-1.073-2.695-1.073-.364-.924-.89-1.17-.89-1.17-.725-.496.056-.486.056-.486.803.056 1.225.824 1.225.824.714 1.223 1.873.87 2.33.665.072-.517.278-.87.507-1.07-1.777-.2-3.644-.888-3.644-3.953 0-.873.31-1.587.823-2.147-.09-.202-.36-1.015.07-2.117 0 0 .67-.215 2.2.82.64-.178 1.32-.266 2-.27.68.004 1.36.092 2 .27 1.52-1.035 2.19-.82 2.19-.82.43 1.102.16 1.915.08 2.117.51.56.82 1.274.82 2.147 0 3.073-1.87 3.75-3.65 3.947.28.24.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.14.46.55.38C13.71 14.53 16 11.53 16 8c0-4.418-3.582-8-8-8" />
    </SvgIcon>
);

const root = {
    path: '/',
    exact: true,
    headComponent: null,
    contentComponent: null,
    drawerEntry: {
        icon: (<IconHome />),
        text: 'Startseite',
        href: null,
        insertDivider: false,
    },
};

const shows = {
    path: '/shows',
    exact: false,
    headComponent: PageShowHead,
    contentComponent: PageShowBody,
    drawerEntry: {
        icon: (<IconPeople />),
        text: 'Vorstellungen',
        href: null,
        insertDivider: false,
    },
};

const productions = {
    path: '/productions',
    exact: false,
    headComponent: null,
    contentComponent: null,
    drawerEntry: {
        icon: (<IconAccountBalance />),
        text: 'Produktionen',
        href: null,
        insertDivider: false,
    },
};

const actors = {
    path: '/actors',
    exact: false,
    headComponent: null,
    contentComponent: null,
    drawerEntry: {
        icon: (<IconFace />),
        text: 'Darsteller',
        href: null,
        insertDivider: true,
    },
};

const legal = {
    path: '/legal',
    exact: true,
    headComponent: null,
    contentComponent: null,
    drawerEntry: {
        icon: null,
        text: 'Impressum',
        href: null,
        insertDivider: false,
    },
};

const github = {
    path: null,
    exact: false,
    headComponent: null,
    contentComponent: null,
    drawerEntry: {
        icon: (<IconGithub />),
        text: 'Github',
        href: 'http://www.github.com/tanzdervampire',
        insertDivider: false,
    },
};

export default [
    root, shows, productions, actors, legal, github,
];