---
slug: rethinking-s3-storage.md
title: Rethinking Our S3 Storage Strategy
date: 02/02/2026
---

# Rethinking Our S3 Storage Strategy

## Context

In an application, users can upload images, audio and video files which are stored in an S3 bucket.

## Problem

S3 bucket storage can become bloated after time, especially when it's likely users will duplicate objects.

## Options

On upload, or when generating the presigned s3 upload url, check if asset exists. When S3 objects are stored with a user defined file name as the key, this makes checking against existing objects diffuclt and allows duplicates.

## Decision

The decision was to use a similar approach to files as does git. First, I calculate the SHA256 hash of the file and use it as the key for the object in S3 storage. Then, I and keep a record of a user's objects in persisted storage, for example a record in a DynamoDB table. Multiple users may and often do reuse the same image, audio file, etc, but now only a single object is required in storage, and the record in persisted storage acts as a pointer to the object.

## Outcome

Deduplication of objects in S3 storage (cut our production storage usage by over 40%).
