package utils_tests

import (
	"fmt"
	"testing"
	"speed-roulette/backend/utils"
)

func TestGenerateNumCoversAll(t *testing.T) {
	var counts [38]int

	for i := 0; i < 10000; i++ {
		num := utils.GenerateNum()
		if num < 0 || num >= 38 {
			t.Fatalf("Generated number out of range: %d", num)
		}
		counts[num]++
	}

	fmt.Println("Generating counts of each number after 10,000 iterations:")

	// Verify that each number from 0 to 37 was generated at least once
	for i, count := range counts {
		if count == 0 {
			t.Errorf("Number %d was never generated", i)
		}
		if count > 600 {
			t.Errorf("Number %2d was generated %d times", i, count)
		}

		if i == 37 {
			fmt.Printf("00: %d\n", count)
		} else {
			fmt.Printf("%2d: %d\n", i, count)
		}
	}
}