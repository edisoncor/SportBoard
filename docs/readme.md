# Documentación técnica con Quarto

Quarto es una plataforma de código abierto para crear, publicar y compartir documentos técnicos, reportes, sitios web y libros interactivos. Permite combinar texto, código, visualizaciones y resultados en un solo documento reproducible.

## ¿Para qué se usa Quarto en este proyecto?
- Documentar la arquitectura, microservicios y procesos de SportBoard.
- Generar documentación técnica navegable en formato web, PDF o Word.
- Integrar código, ejemplos y visualizaciones en la documentación.

## Instalación de Quarto

Puedes instalar Quarto en macOS, Windows o Linux. Consulta la [documentación oficial](https://quarto.org/docs/get-started/) para más detalles.

### Instalación rápida en macOS (Homebrew):
```bash
brew install quarto
```

### Instalación rápida en Ubuntu/Debian:
```bash
sudo apt-get install quarto-cli
```

### Instalación rápida en Windows (choco):
```bash
choco install quarto
```

## Comandos básicos de Quarto

- **Renderizar toda la documentación:**
  ```bash
  quarto render
  ```
- **Servir la documentación en modo desarrollo (hot reload):**
  ```bash
  quarto preview
  ```
- **Renderizar un archivo específico:**
  ```bash
  quarto render docs/components/microservices/ms-catalogs.qmd
  ```
- **Publicar en GitHub Pages u otros servicios:**
  ```bash
  quarto publish gh-pages
  ```

## Formatos soportados por Quarto

Quarto permite generar documentación en diferentes formatos a partir de archivos `.qmd` (Quarto Markdown):

- **HTML (sitio web):**
  ```bash
  quarto render --to html
  ```
- **PDF (usando LaTeX):**
  ```bash
  quarto render --to pdf
  ```
- **Microsoft Word:**
  ```bash
  quarto render --to docx
  ```
- **Presentaciones Reveal.js:**
  ```bash
  quarto render --to revealjs
  ```

## Ejemplo de archivo Quarto Markdown (`.qmd`)

```markdown
---
title: "Ejemplo de documento Quarto"
format: html
---

# Introducción

Este es un ejemplo de documento Quarto con código y visualizaciones.

```{python}
print("¡Hola desde Quarto!")
```
```

## Recursos útiles
- [Documentación oficial de Quarto](https://quarto.org/docs/)
- [Guía de inicio rápido](https://quarto.org/docs/get-started/)
- [Ejemplos de proyectos](https://quarto.org/docs/gallery/)

## Buenas prácticas de documentación con Quarto

- Usa títulos y subtítulos claros para estructurar la información.
- Incluye descripciones breves al inicio de cada archivo `.qmd`.
- Utiliza listas, tablas y bloques de código para mejorar la legibilidad.
- Documenta ejemplos de uso y casos prácticos.
- Mantén la documentación actualizada junto con el código.
- Prefiere el formato Markdown enriquecido de Quarto para notas, advertencias y tips.
- Usa enlaces internos para facilitar la navegación entre secciones y archivos.
- Integra visualizaciones y resultados de código cuando sea relevante.
- Revisa la ortografía y gramática antes de publicar.
- Aprovecha los metadatos YAML (`title`, `author`, `date`, etc.) para mejorar la presentación.

## Ejemplos de advertencias, notas y tips en Quarto

::: {.callout-note}
## Nota
Puedes usar bloques de nota para resaltar información importante o aclaraciones en la documentación.
:::

::: {.callout-warning}
## Advertencia
Asegúrate de tener instalado LaTeX si deseas renderizar documentos en PDF con Quarto.
:::

::: {.callout-tip}
## Tip
Utiliza `quarto preview` para ver los cambios en tiempo real mientras editas tu documentación.
:::
