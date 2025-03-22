// src/utils/parsePosition.ts
import type { BoardData } from '../types';


export function parsePosition(source: string): BoardData {
	// TODO: Implement real parsing logic
	// Placeholder returns fixed values
	return {
		X: [{ point: 13, count: 2 }, { point: 6, count: 5 }],
		O: [{ point: 24, count: 2 }, { point: 8, count: 3 }]
	};
}
