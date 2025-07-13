package tests

import (
    "reflect"
	"testing"

	"speed-roulette/backend/models"
	"speed-roulette/backend/utils"
)

// helper: build expected struct in one line
func P(color, parity, half, dozen, row string) models.NumProperties {
	return models.NumProperties{
		Color:  color,
		Parity: parity,
		Half:   half,
		Dozen:  dozen,
		Row:    row,
	}
}

func TestGetNumProperties(t *testing.T) {

	cases := []struct {
		num      int
		expected models.NumProperties
	}{
		// ───────── Green (0 / 00) ─────────
		{0, P("green", "none", "none", "none", "none")},
		{37, P("green", "none", "none", "none", "none")}, // treat 37 as 00

		// ───────── Main Table ─────────
		{1, P("red", "odd", "low", "first", "bottom")},
		{2, P("black", "even", "low", "first", "middle")},
		{3, P("red", "odd", "low", "first", "top")},
		{4, P("black", "even", "low", "first", "bottom")},
		{5, P("red", "odd", "low", "first", "middle")},
		{6, P("black", "even", "low", "first", "top")},
		{7, P("red", "odd", "low", "first", "bottom")},
		{8, P("black", "even", "low", "first", "middle")},
		{9, P("red", "odd", "low", "first", "top")},
		{10, P("black", "even", "low", "first", "bottom")},
		{11, P("black", "odd", "low", "first", "middle")},
		{12, P("red", "even", "low", "first", "top")},
		{13, P("black", "odd", "low", "second", "bottom")},
		{14, P("red", "even", "low", "second", "middle")},
		{15, P("black", "odd", "low", "second", "top")},
		{16, P("red", "even", "low", "second", "bottom")},
		{17, P("black", "odd", "low", "second", "middle")},
		{18, P("red", "even", "low", "second", "top")},
		{19, P("red", "odd", "high", "second", "bottom")},
		{20, P("black", "even", "high", "second", "middle")},
		{21, P("red", "odd", "high", "second", "top")},
		{22, P("black", "even", "high", "second", "bottom")},
		{23, P("red", "odd", "high", "second", "middle")},
		{24, P("black", "even", "high", "second", "top")},
		{25, P("red", "odd", "high", "third", "bottom")},
		{26, P("black", "even", "high", "third", "middle")},
		{27, P("red", "odd", "high", "third", "top")},
		{28, P("black", "even", "high", "third", "bottom")},
		{29, P("black", "odd", "high", "third", "middle")},
		{30, P("red", "even", "high", "third", "top")},
		{31, P("black", "odd", "high", "third", "bottom")},
		{32, P("red", "even", "high", "third", "middle")},
		{33, P("black", "odd", "high", "third", "top")},
		{34, P("red", "even", "high", "third", "bottom")},
		{35, P("black", "odd", "high", "third", "middle")},
		{36, P("red", "even", "high", "third", "top")},
	}

	for _, tc := range cases {
		got := utils.GetNumProperties(tc.num)

		if !reflect.DeepEqual(got, tc.expected) {
			t.Errorf("GetNumProperties(%d) ➞ %#v; want %#v", tc.num, got, tc.expected)
		}

		// ── Individual helpers (defensive; double-checks table) ──
		if col := utils.GetColor(tc.num); col != tc.expected.Color {
			t.Errorf("GetColor(%d) = %q; want %q", tc.num, col, tc.expected.Color)
		}
		if par := utils.GetParity(tc.num); par != tc.expected.Parity {
			t.Errorf("GetParity(%d) = %q; want %q", tc.num, par, tc.expected.Parity)
		}
		if half := utils.GetHalf(tc.num); half != tc.expected.Half {
			t.Errorf("GetHalf(%d) = %q; want %q", tc.num, half, tc.expected.Half)
		}
		if doz := utils.GetDozen(tc.num); doz != tc.expected.Dozen {
			t.Errorf("GetDozen(%d) = %q; want %q", tc.num, doz, tc.expected.Dozen)
		}
		if row := utils.GetRow(tc.num); row != tc.expected.Row {
			t.Errorf("GetRow(%d) = %q; want %q", tc.num, row, tc.expected.Row)
		}
	}
}
