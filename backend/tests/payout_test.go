package tests

import (
	"testing"

	"speed-roulette/backend/models"
	"speed-roulette/backend/utils"
)

// bet is a helper that creates a minimal Bet with a chip value
func bet(gridID string, idx int, v float64) models.Bet {
	return models.Bet{GridID: gridID, GridIndex: idx, ChipValue: v}
}

// exact inner hit should pay 36×
func TestPayout_InnerExact(t *testing.T) {
	n := 25
	idx := utils.GetGridIndex(n)
	got := utils.Payout([]models.Bet{bet("inner", idx, 1)}, n)
	want := 36.0
	if got != want {
		t.Fatalf("inner exact: got %v want %v", got, want)
	}
}

// avenue (six‑line) should pay 6×
func TestPayout_InnerAvenue(t *testing.T) {
	var idx, spin int
	for i := 114; i < 400; i += 2 {
		for n := 0; n <= 36; n++ {
			if utils.GetMultiplier(models.Bet{GridIndex: i}, n) == 6 {
				idx, spin = i, n
				break
			}
		}
		if idx != 0 {
			break
		}
	}
	if idx == 0 {
		t.Skip("avenue not found; grid changed")
	}
	got := utils.Payout([]models.Bet{bet("inner", idx, 1)}, spin)
	want := 6.0
	if got != want {
		t.Fatalf("avenue idx %d spin %d: got %v want %v", idx, spin, got, want)
	}
}

// street should pay 12×
func TestPayout_InnerStreet(t *testing.T) {
	var idx, spin int
	for i := 115; i < 400; i += 2 {
		for n := 0; n <= 36; n++ {
			if utils.GetMultiplier(models.Bet{GridIndex: i}, n) == 12 {
				idx, spin = i, n
				break
			}
		}
		if idx != 0 {
			break
		}
	}
	if idx == 0 {
		t.Skip("street not found; grid changed")
	}
	got := utils.Payout([]models.Bet{bet("inner", idx, 2)}, spin)
	want := 24.0 // 2×12
	if got != want {
		t.Fatalf("street idx %d spin %d: got %v want %v", idx, spin, got, want)
	}
}

// split should pay 18×
func TestPayout_InnerSplit(t *testing.T) {
	var idx, spin int
	for i := 1; i < 114; i += 2 {
		for n := 0; n <= 36; n++ {
			if utils.GetMultiplier(models.Bet{GridIndex: i}, n) == 18 {
				idx, spin = i, n
				break
			}
		}
		if idx != 0 {
			break
		}
	}
	if idx == 0 {
		t.Skip("split not found; grid changed")
	}
	got := utils.Payout([]models.Bet{bet("inner", idx, 1.5)}, spin)
	want := 27.0 // 1.5×18
	if got != want {
		t.Fatalf("split idx %d spin %d: got %v want %v", idx, spin, got, want)
	}
}

// corner should pay 9×
func TestPayout_InnerCorner(t *testing.T) {
	var idx, spin int
	for i := 2; i < 114; i += 2 {
		for n := 0; n <= 36; n++ {
			if utils.GetMultiplier(models.Bet{GridIndex: i}, n) == 9 {
				idx, spin = i, n
				break
			}
		}
		if idx != 0 {
			break
		}
	}
	if idx == 0 {
		t.Skip("corner not found; grid changed")
	}
	got := utils.Payout([]models.Bet{bet("inner", idx, 2)}, spin)
	want := 18.0
	if got != want {
		t.Fatalf("corner idx %d spin %d: got %v want %v", idx, spin, got, want)
	}
}

func TestPayout_ZerosBuckets(t *testing.T) {
	cases := []struct {
		idx, spin int
		want      float64
	}{
		{0, 0, 36}, {1, 0, 18}, {1, 37, 18}, {2, 37, 36},
	}
	for _, c := range cases {
		got := utils.Payout([]models.Bet{bet("zeros", c.idx, 1)}, c.spin)
		if got != c.want {
			t.Errorf("zeros idx %d spin %d: got %v want %v", c.idx, c.spin, got, c.want)
		}
	}
}

func TestPayout_DozensRowsOuter(t *testing.T) {
	if utils.Payout([]models.Bet{bet("dozens", 0, 1)}, 5) != 3 {
		t.Error("dozen low failed")
	}
	if utils.Payout([]models.Bet{bet("rows", 1, 2)}, 20) != 6 {
		t.Error("row middle failed")
	}
	outer := []struct{ idx, spin int }{{0, 8}, {1, 2}, {2, 3}, {3, 6}, {4, 5}, {5, 35}}
	for _, o := range outer {
		if utils.Payout([]models.Bet{bet("outer", o.idx, 1)}, o.spin) != 2 {
			t.Errorf("outer idx %d spin %d failed", o.idx, o.spin)
		}
	}
}
