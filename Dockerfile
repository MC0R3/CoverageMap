FROM php:8.2-apache
WORKDIR /var/www/html
COPY . /var/www/html/
EXPOSE 8080

RUN sed -i 's/80/8080/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf
RUN chown -R www-data:www-data /var/www/html
CMD ["apache2-foreground"]
