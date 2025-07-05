package com.aqua.guard.monitoramento.api.exception;

import com.aqua.guard.monitoramento.api.v1.dto.error.ErrorResponseDTO;
import com.aqua.guard.monitoramento.api.v1.dto.error.ValidationErrorDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.security.access.AccessDeniedException;

import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handler para erros de validação
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorDTO> handleValidationErrors(MethodArgumentNotValidException ex, HttpServletRequest request) {
        var fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> new ValidationErrorDTO.FieldValidationError(error.getField(), error.getDefaultMessage()))
                .collect(Collectors.toList());

        var errorDTO = new ValidationErrorDTO(
                Instant.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Erro de Validação",
                request.getRequestURI(),
                fieldErrors
        );
        return new ResponseEntity<>(errorDTO, HttpStatus.BAD_REQUEST);
    }

    // Handler para "Não Encontrado"
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleEntityNotFound(EntityNotFoundException ex, HttpServletRequest request) {
        var errorDTO = new ErrorResponseDTO(
                Instant.now(),
                HttpStatus.NOT_FOUND.value(),
                "Recurso não encontrado",
                ex.getMessage(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(errorDTO, HttpStatus.NOT_FOUND);
    }

    // Handler para "Acesso Negado"
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponseDTO> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        var errorDTO = new ErrorResponseDTO(
                Instant.now(),
                HttpStatus.FORBIDDEN.value(),
                "Acesso Negado",
                "Você não tem permissão para acessar este recurso.",
                request.getRequestURI()
        );
        return new ResponseEntity<>(errorDTO, HttpStatus.FORBIDDEN);
    }

    // Handler para conflitos de estado (ex: "email já em uso")
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponseDTO> handleIllegalState(IllegalStateException ex, HttpServletRequest request) {
        var errorDTO = new ErrorResponseDTO(
                Instant.now(),
                HttpStatus.CONFLICT.value(),
                "Conflito de Estado",
                ex.getMessage(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(errorDTO, HttpStatus.CONFLICT);
    }

    // Handler genérico para qualquer outra exceção não tratada
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGenericException(Exception ex, HttpServletRequest request) {
        var errorDTO = new ErrorResponseDTO(
                Instant.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Erro Interno do Servidor",
                "Ocorreu um erro inesperado. Tente novamente mais tarde.",
                request.getRequestURI()
        );
        // É uma boa prática logar a exceção real no servidor
        // ex: log.error("Erro inesperado:", ex);
        return new ResponseEntity<>(errorDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}