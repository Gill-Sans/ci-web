export const environment = {
    production: false,
    keycloak: {
        realm: 'capit',
        clientId: 'angular-client',
        url: 'https://capit-dev.keycloak.mertenshome.com',
        postLogoutRedirectUri: 'https://capit-dev.keycloak.mertenshome.com/logout',
    },
    backend: {
        url: 'https://capit-dev.gateway.mertenshome.com',
        url_domain: 'capit-dev.gateway.mertenshome.com'
    }
}
