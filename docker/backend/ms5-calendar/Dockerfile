# Usa una imagen base de Maven con OpenJDK 17 para construir el JAR
FROM maven:3.8.4-openjdk-17 AS build

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de configuración de Maven y el código fuente al contenedor
COPY backend/calendarioModule/pom.xml /app/pom.xml
COPY backend/calendarioModule/src /app/src

# Ejecuta Maven para construir el JAR, omitiendo las pruebas
RUN mvn clean install -DskipTests

# Usa una imagen base de OpenJDK 17 para ejecutar el JAR
FROM eclipse-temurin:17-jre

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el JAR generado desde la etapa de construcción anterior
COPY --from=build /app/target/calendarioModule-0.0.1-SNAPSHOT.jar app.jar

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 8080

# Define el comando predeterminado para ejecutar la aplicación
CMD ["java", "-jar", "app.jar"]