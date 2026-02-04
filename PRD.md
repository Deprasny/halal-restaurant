[Skip to content](https://www.notion.so/Halal-Korea-List-2fc0d3bce16a80108ea1e95744b55901#main)

# Halal Korea List

### 1\. Product Overview

Name: Halal Korea (working title)

Goal:

A simple test project that displays halal restaurant information in Korea

by loading a local KMZ file bundled inside the codebase.

The main purpose is to test:

Local KMZ parsing

Geographic data rendering with Maplibre

UI list, search, and map integration

Target Users:

Muslim travelers in Korea

Muslim students and residents

Anyone looking for halal food

### 2\. Core Features (MVP)

#### Must Have

Local KMZ Data Loading

KMZ file stored inside the repository

Extract and parse KMZ at build-time or runtime

Convert placemarks into structured restaurant data

Restaurant List

Restaurant name

City / area (parsed from description or coordinates)

Halal status (from KMZ description)

Distance from user (calculated from coordinates)

Search

Search by restaurant name

Search by city / area

Restaurant Detail

Name

Address (from KMZ description)

Halal information (certified / Muslim-friendly)

Opening hours (if available)

Phone number (if available)

Map View

Display restaurant markers using Maplibre

Center map based on user location

Open external navigation (optional)

#### Nice to Have (Optional)

Favorite / bookmark restaurant

Simple rating (1–5 stars)

### 3\. User Flow

Application loads local KMZ file

KMZ data is parsed into restaurant objects

User opens the app

App shows nearby halal restaurants

User searches or selects a restaurant

User views restaurant details on list or map

### 4\. Data Structure (Derived from KMZ)

#### Restaurant

id

name

(Placemark name)

city

(best-effort parsing)

address

(from KMZ description)

latitude

(from coordinates)

longitude

(from coordinates)

halal\_status

(parsed from description)

opening\_hours

(optional)

phone

(optional)

source

=

local\_kmz

### 5\. Data Source & Processing

Primary Data Source:

Local KMZ file committed to the repository
(e.g.

/data/halal-restaurants.kmz

)

Processing Flow:

Read KMZ file from local filesystem

Extract KML from KMZ

Parse placemarks

Normalize data into in-memory objects

Serve data directly to UI (no external APIs)

### 6\. Tech Stack

Frontend: Next.js

Backend: Supabase

Maps: Maplibre GL JS

Data Source: Local KMZ file

### 7\. Out of Scope

External APIs (Google Maps, Places, etc.)

User authentication

Reviews and comments

Payment system

Admin dashboard

Database persistence

### 8\. Success Criteria

Local KMZ file loads without errors

KMZ data is parsed correctly

Restaurant list renders correctly

Maplibre displays markers accurately

Search works on parsed KMZ data

KMZ File :
[https://drive.google.com/file/d/1YtRtUXgp8NOpIfNGhHMBXCV7KmZySCLR/view?usp=sharing](https://drive.google.com/file/d/1YtRtUXgp8NOpIfNGhHMBXCV7KmZySCLR/view?usp=sharing)

Source KMZ File (if needed) :
[https://www.google.com/maps/d/u/0/viewer?mid=10rZlYa6GN93AbUi3JVpfSpR7oWv2Xzc&ll=37.34198648481445%2C127.06732251736683&z=10](https://www.google.com/maps/d/u/0/viewer?mid=10rZlYa6GN93AbUi3JVpfSpR7oWv2Xzc&ll=37.34198648481445%2C127.06732251736683&z=10)
