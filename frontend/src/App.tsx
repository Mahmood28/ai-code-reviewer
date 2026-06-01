import { useState } from 'react';
import CodeEditor from './components/CodeEditor.tsx';
import ReviewPanel from './components/ReviewPanel.tsx';
import ConfigModal from './components/ConfigModal.tsx';
import type { ReviewResult } from './types.ts';

type Language = 'python' | 'javascript' | 'typescript' | 'java' | 'go' | 'rust' | 'cpp' | 'sql';

const SAMPLES: Partial<Record<Language, string>> = {
  python: `import sqlite3

def get_user(username, password):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    query = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'"
    cursor.execute(query)
    return cursor.fetchone()

def process_data(items):
    result = []
    for i in range(len(items)):
        x = items[i]
        if x != None:
            if x > 0:
                result.append(x * 2)
    return result

GLOBAL_CONFIG = {"debug": True, "secret_key": "abc123hardcoded"}`,

  javascript: `const express = require('express');
const app = express();
var db = require('./database');

app.get('/user', function(req, res) {
  var userId = req.query.id;
  db.query("SELECT * FROM users WHERE id = " + userId, function(err, results) {
    if (err) { console.log(err); res.send(err); }
    res.json(results);
  });
});

function checkAuth(user, pass) {
  if (user == 'admin' && pass == 'password123') return true;
  return false;
}

app.listen(3000);`,

  typescript: `import express, { Request, Response } from 'express';
const app = express();

interface User {
  id: number;
  name: string;
  password: string;
}

const users: User[] = [];

app.get('/user', (req: Request, res: Response) => {
  const id = req.query.id;
  // BUG: no validation, type coercion issues
  const user = users.find(u => u.id == (id as any));
  if (!user) res.send('not found');
  res.json(user);
});

function hashPassword(pw: string) {
  // TODO: use bcrypt
  return pw;
}

const SECRET = "hardcoded-jwt-secret-123";
app.listen(3000);`,

  java: `import java.sql.*;

public class UserService {
    private static final String DB_URL = "jdbc:mysql://localhost/mydb";
    private static final String PASSWORD = "admin123"; // hardcoded

    public User getUser(String username) throws Exception {
        Connection conn = DriverManager.getConnection(DB_URL, "root", PASSWORD);
        Statement stmt = conn.createStatement();
        // SQL injection vulnerability
        String query = "SELECT * FROM users WHERE username = '" + username + "'";
        ResultSet rs = stmt.executeQuery(query);
        User user = null;
        if (rs.next()) {
            user = new User(rs.getInt("id"), rs.getString("username"));
        }
        // connection never closed
        return user;
    }

    public void processItems(int[] items) {
        int result = 0;
        for (int i = 0; i < items.length; i++) {
            result = result + items[i] * 2;
        }
        System.out.println(result);
    }
}`,

  go: `package main

import (
    "database/sql"
    "fmt"
    "net/http"
)

var db *sql.DB
var secretKey = "hardcoded-secret"

func getUser(w http.ResponseWriter, r *http.Request) {
    username := r.URL.Query().Get("username")
    // SQL injection
    row := db.QueryRow("SELECT * FROM users WHERE username = '" + username + "'")
    var id int
    var name string
    row.Scan(&id, &name) // error ignored
    fmt.Fprintf(w, "User: %s", name)
}

func processData(items []int) []int {
    result := []int{}
    for i := 0; i < len(items); i++ {
        if items[i] > 0 {
            result = append(result, items[i]*2)
        }
    }
    return result
}

func main() {
    http.HandleFunc("/user", getUser)
    http.ListenAndServe(":8080", nil)
}`,
};

export default function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('python');
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configOpen, setConfigOpen] = useState(false);

  async function handleReview(): Promise<void> {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setReview(null);

    try {
      const res = await fetch('/_/backend/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error((json as { error: string }).error ?? `HTTP ${res.status}`);
      setReview((json as { data: ReviewResult }).data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateRows: '56px 1fr', height: '100vh' }}>
      <header style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 24px', borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 16 }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
          </svg>
          Smart Code Reviewer
        </div>
        <span style={{
          fontSize: 11, background: 'var(--accent)', color: 'white',
          padding: '2px 8px', borderRadius: 20, fontWeight: 600,
        }}>AI-Powered</span>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setConfigOpen(true)}
          style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            color: 'var(--muted)', padding: '6px 14px', borderRadius: 6,
            cursor: 'pointer', fontSize: 13,
          }}
        >
          ℹ About
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
        <CodeEditor
          code={code}
          language={language}
          loading={loading}
          onCodeChange={setCode}
          onLanguageChange={(lang) => setLanguage(lang as Language)}
          onReview={handleReview}
          onLoadSample={() => setCode(SAMPLES[language] ?? '')}
        />
        <ReviewPanel review={review} loading={loading} error={error} code={code} language={language} />
      </div>

      {configOpen && <ConfigModal onClose={() => setConfigOpen(false)} />}
    </div>
  );
}
