#!/bin/bash

SESSION_DIR="./db"

if [ -d "$SESSION_DIR" ]; then
    echo "Lösche Session-Ordner: $SESSION_DIR"
    rm -rf "$SESSION_DIR"
    echo "Session-Ordner wurde gelöscht."
else
    echo "Session-Ordner existiert nicht: $SESSION_DIR"
fi
