# API Platform

## Configuration

### *Globale*

S'applique à toute les ressources de l'application.  
<https://api-platform.com/docs/core/configuration/>

```yml
# config/packages/api_platform.yml
api_platform:
    ...
    collection:
        order: 'ASC'
        pagination: 
            enabled: false
            items_per_page: 10
```

### *Par ressource*

Surcharge la configuration pour une ressource en particulier.

```php
/**
 * @ApiResource(
 *  attributes={
 *      "order"={"sentAt":"desc"}
 *      "pagination_enabled"=true,
 *      "pagination_items_per_page=20,

 *  }
 * )
 */
class Invoice
{ ... }
```

### *Par requete*

Surcharge la configuration pour une requete en particulier.
```yml
# config/packages/api_platform.yml
api_platform:
    ...
    collection:
        pagination: 
            client_enabled: true   <--
            client_items_per_page: true   <--
```
OU
```php
/**
 * @ApiResource(
 *  attributes={
 *      "pagination_client_enabled"=true   <--
 *      "pagination_client_items_per_page"=true  <--
 *  }
 * )
 */
class Invoice
{ ... }
```
&
```
http://localhost:8000/api/customers?pagination=true&itemsPerPage=50
``` 

***

## Filters

### *SearchFilter*

Effectue une recherche parmis les champs de l'entité.
```php
Recherche sur tous les champs:

/**
 * @ApiResource()
 * @ApiFilter(SearchFilter::class)
 */

Recherche sur des champs particuliers:

/**
 * @ApiFilter(SearchFilter::class, properties={"firstName":partial, "lastName":"partial"})
 */
```
```
http://localhost:8000/api/customers?firstName=stephane
```
stratégies de recherche: exact, partial, start, end, word_start

### *OrderFilter*

Tri la recherche par rapport à l'ordre indiqué.

```php
tri sur tous les champs:

/**
 * @ApiResource()
 * @ApiFilter(OrderFilter::class)
 */

Recherche sur des champs particuliers:

/**
 * @ApiResource()
 * @ApiFilter(OrderFilter::class, properties={ "amount", "sentAt"})
 */
class Invoice
{ ... }
```
```
http://localhost:8000/api/customers?order[amount]=desc
```  


Les filtre sont cumulables: 

```php
/**
 * @ApiResource()
 * @ApiFilter(OrderFilter::class, properties={ "amount", "sentAt"})
 * @ApiFilter(SearchFilter::class, properties={"firstName":partial, "lastName":"partial"})
 */
```
