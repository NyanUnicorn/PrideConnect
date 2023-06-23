package main

import (
	"bytes"
	"io"
	"os"
	"testing"
)

// Redirects standard output to a buffer
func captureOutput(f func()) string {
	old := os.Stdout
	r, w, _ := os.Pipe()
	os.Stdout = w

	f()

	// Reset standard output
	w.Close()
	os.Stdout = old

	var buf bytes.Buffer
	io.Copy(&buf, r)

	return buf.String()
}

func TestMainOutput(t *testing.T) {
	expected := "Hello, World!\n" // Expected output from main.go

	actual := captureOutput(main)

	if actual != expected {
		t.Errorf("Expected output: %s\nActual output: %s", expected, actual)
	}
}
