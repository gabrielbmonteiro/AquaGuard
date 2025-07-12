package com.aqua.guard.monitoramento.api.v1.ws;

import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/debug")
public class DebugWS {

    private static final String HMAC_ALGORITHM = "HmacSHA256";

    // Use a chave secreta REAL da sua base de dados aqui
    private final String testSecretKey = "4d481ded56e74eed9a26a9a3b2d90d113245f75027fb4299bc8a3e02d434fc76";

    @PostMapping("/generate-signature")
    public Map<String, String> generateSignature(@RequestBody Map<String, String> payload) {
        String body = payload.get("body");
        String serialNumber = payload.get("serialNumber");

        long timestamp = System.currentTimeMillis() / 1000L;
        String dataToSign;

        // Decide o que assinar com base no que foi enviado
        if (body != null && !body.isEmpty()) {
            dataToSign = timestamp + "." + body;
        } else if (serialNumber != null && !serialNumber.isEmpty()) {
            dataToSign = serialNumber + "." + timestamp;
        } else {
            throw new IllegalArgumentException("Forneça 'body' para POST ou 'serialNumber' para GET");
        }

        // Calcula a assinatura HMAC
        String signature = calculateHmac(testSecretKey, dataToSign);

        // Prepara a resposta
        Map<String, String> response = new HashMap<>();
        response.put("X-Timestamp", String.valueOf(timestamp));
        response.put("X-API-Key", testSecretKey);
        response.put("Authorization", "Bearer " + signature);
        response.put("Data-Que-Foi-Assinada", dataToSign); // Para debug
        response.put("Assinatura-Gerada-Base64", signature); // Para debug

        return response;
    }

    private String calculateHmac(String secret, String data) {
        try {
            Mac sha256_HMAC = Mac.getInstance(HMAC_ALGORITHM);
            SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM);
            sha256_HMAC.init(secret_key);
            byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao calcular HMAC", e);
        }
    }
}