export const environment = {
    production: false,
    keycloak: {
        realm: 'capit',
        clientId: 'angular-client',
        url: 'http://localhost:8180',
        postLogoutRedirectUri: 'http://localhost:4200/logout',
    },
    backend: {
        url: 'http://localhost:9001',
        url_domain: 'localhost:9001'
    }
}
