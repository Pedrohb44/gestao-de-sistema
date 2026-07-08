package com.gestao.gestaosystem.security;

import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;
import com.azure.security.keyvault.secrets.models.KeyVaultSecret;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@ConditionalOnProperty(name = "azure.keyvault.enabled", havingValue = "true")
public class KeyVaultSecretProvider {
    private final SecretClient secretClient;

    public KeyVaultSecretProvider(@Value("${azure.keyvault.uri:}") String keyVaultUri,
                                  @Value("${azure.keyvault.identity.client-id:}") String managedIdentityClientId) {
        if (!StringUtils.hasText(keyVaultUri)) {
            throw new IllegalStateException("Azure Key Vault URI must be configured via 'azure.keyvault.uri' when Key Vault is enabled.");
        }

        DefaultAzureCredentialBuilder credentialBuilder = new DefaultAzureCredentialBuilder();
        if (StringUtils.hasText(managedIdentityClientId)) {
            credentialBuilder.managedIdentityClientId(managedIdentityClientId);
        }

        this.secretClient = new SecretClientBuilder()
                .vaultUrl(keyVaultUri)
                .credential(credentialBuilder.build())
                .buildClient();
    }

    public String getSecret(String secretName) {
        if (!StringUtils.hasText(secretName)) {
            throw new IllegalArgumentException("Secret name must not be blank.");
        }

        try {
            KeyVaultSecret secret = secretClient.getSecret(secretName);
            return secret.getValue();
        } catch (RuntimeException ex) {
            throw new IllegalStateException("Unable to retrieve secret '" + secretName + "' from Azure Key Vault.", ex);
        }
    }
}
