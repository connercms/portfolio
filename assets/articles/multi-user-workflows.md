---
slug: rethinking-s3-storage.md
title: Enabling Multi-User Workflows With Cloud Backups
date: 12/02/2026
---

# Enabling Multi-User Workflows With Cloud Backups

## Context

The business required a desktop application for users to create "projects". A project consists of 10+ JSON files that are modified through the application UI. The application needed to be offline-first so it could be used in situations with no connectivity, while also providing the ability for a user to upload their project to the cloud. Once in the cloud, multiple users can download the project, work on it, and upload their changes back to the cloud.

## Problem

Multi-user workflows introduce questions of authoritative state and race conditions between competing uploads.

## Options

The simplest option considered was a "checkout" option that would lock the project when a user is interacting with it. This doesn't work well when multiple users wish to work on a project in tandem. Another option was a source-control like approach, comparing data in the project files and presenting the changes to the user when there was a conflict. This approach is problematic because end users do not understand the underlying data structures, and exposing that complexity would likely create confusion.

## Decision

A SHA-256 checksum is calculated from the data for each file. On first upload, the checksum is both stored as metadata in the database and recorded locally. When a project is downloaded for the first time, the same checksum is recorded locally. This value becomes the file’s baseline.

When a user attempts to upload changes, two comparisons are performed.

Cloud checksum vs. recorded checksum

If the checksum retrieved from the cloud does not match the locally recorded baseline checksum, the cloud version has changed since the last sync. In this case, the user must pull and reconcile changes before uploading.

Local checksum vs. recorded checksum

If the checksum of the current local file differs from the recorded baseline checksum, the file has been modified locally and should be included in the upload.

If neither comparison shows divergence, no action is required.

## Outcome

Multiple users can work on different parts of the project concurrently, with deterministic conflict detection at the file level.
