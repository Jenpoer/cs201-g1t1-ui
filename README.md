# CS201 G1T1 Yelp Project -- User Interface

## Team Members

- CHUA PEI WEN REGINA
- JENNIFER POERNOMO
- MICHELLE LEONG HWEE-LING
- NAOMI OH JIA LI
- SARAH ANN HOGAN

## Problem Statement

Finding the most commonly occuring business category in an area.

## Objectives

1. To find out the businesses in an area defined by a rectangle of latitude and longitude
2. To find the most popular category of business in that area

## User Guide

### Steps

**Back-end Setup**
See cs201-g1t1-main repository

1. Install Maven extension and Spring Boot extensions in IDE
2. Create a new database connection on MySQL Workbench and enter all the required connection parameters of the AWS MySQL database server.

Host: cs201db.cowijpva0ytl.us-east-1.rds.amazonaws.com
<br/>
Port: 3306
<br/>
DB name: cs201g1t1

3. Click on the Test Connection button to connect to the database server.
4. Run the application using the command - "mvn spring-boot:run" in your terminal

#### HTTP methods

Read the README.md file of cs201-g1t1-main repository for documentation

**Front-end setup** 
5. Install the necessary packages using `yarn install`
    - If you do not have yarn yet, install it using `npm install -g yarn`, this requires npm to be installed
    - If you do not have npm, please install it along with Node.js
6. Run the app using `yarn start`
7. Make sure the backend server (from the cs201-g1t1-main repository) is also running
8. Click the "Draw" button on the top left corner to start drawing
9. Click anywhere on the map to define the **top left corner**, then click anywhere on the map to define the **bottom right corner**

## Current Limitations

- Code might not follow the conventional best practice
- Rectangles must be drawn from the top left corner to the bottom right corner
- Currently only for the city of Kyle

## Relevant Links
- Final Presentation Video: https://youtu.be/gFRmH8KLIuY
- Github Repo (Main): https://github.com/Jenpoer/cs201-g1t1-main
- Github Repo (UI): https://github.com/Jenpoer/cs201-g1t1-ui
