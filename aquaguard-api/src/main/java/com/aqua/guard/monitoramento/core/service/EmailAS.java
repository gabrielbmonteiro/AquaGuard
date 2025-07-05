package com.aqua.guard.monitoramento.core.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailAS {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationCode(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("hello@demomailtrap.co");

        message.setTo(to);
        message.setSubject("AquaGuard - Código de Verificação");
        message.setText("Olá! Seu código de verificação é: " + code);

        mailSender.send(message);
    }
}
