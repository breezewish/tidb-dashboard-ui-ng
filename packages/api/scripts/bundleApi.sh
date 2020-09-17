#!/bin/bash
openapi-generator generate -i ../../swaggerspec/swagger.yaml -g typescript-axios -c .openapi_config.yaml -o src
