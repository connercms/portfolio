---
slug: simple-url-shortener-service.md
title: Simple URL Shortener Service
date: 17/02/2026
---

# Simple URL Shortener Service

## Context

Another team accesses objects from an S3 bucket owned by my team by fetching a presigned url from one of my APIs. The presigned url is consumed in a script which is ran on IoT devices during a factory commissioning process, to fetch device configuration data and assets (logos, banners, etc).

## Problem

Due to restrictions on their side, the presigned S3 url generated was too long for the script on the device and caused issues.

## Options

I could easily have used a url shortening service, but that would introduce coupling to a third party.

## Decision

When the API to generate the presigned S3 url is called, I generate a unique ID and insert a record into a DynamoDB table. I enabled a TTL (time to live) column on the table, and I set the value to the same as the expiration of the presigned S3 url. This means the record is automatically expunged at the same time the presigned S3 url expires. I record the presigned S3 url on the data saved to DynamoDB. Instead of returning the presigned S3 url to the client, I return a url corresponding to the route of an API I control, for example GET example.com/repo/:id. Inside the API, I extract the ID from the path and use it to fetch the record containing the actual presigned S3 url. I return a 301 (Moved Permanently) response to the client. To the location header I assign the presigned S3 url, and to the Content-Disposition header I assign "attachment". When the client receives this response, it automatically requests the resource at the correct url and is able to retrieve the asset seamlessly.

## Outcome

The urls I return to the client went from being > 1000 characters to something as short and simple as example.com/repo/00ODNgdoT4gHzD3tcOtps. As a bonus, existing or desired authorization can be implemented on the API to increase security.
