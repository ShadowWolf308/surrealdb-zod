import {
	type Bound,
	BoundExcluded,
	BoundIncluded,
	DateTime,
	Decimal,
	Duration,
	FileRef,
	Future,
	Geometry,
	GeometryCollection,
	GeometryLine,
	GeometryMultiLine,
	GeometryMultiPoint,
	GeometryMultiPolygon,
	GeometryPoint,
	GeometryPolygon,
	Range,
	RecordId,
	RecordIdRange,
	type RecordIdValue,
	StringRecordId,
	Table,
	Uuid,
} from "surrealdb";
import {
	custom,
	NEVER,
	object,
	type output,
	type ZodArray,
	type ZodBigInt,
	type ZodCustom,
	type ZodNumber,
	type ZodObject,
	type ZodString,
	type ZodType,
	undefined as ZodUndefined,
} from "zod";

/**
 * @private
 */
function getValueType(value: unknown): string {
	if (typeof value === "object") {
		if (value === null) {
			return "null";
		}

		return value.constructor.name;
	}

	return typeof value;
}

/**
 * @private
 */
interface ErrorMessageOptions {
	expected: string;
	input: unknown;
}

/**
 * @private
 */
function constructErrorMessage({ expected, input }: ErrorMessageOptions): string {
	const inputType = getValueType(input);

	return `Invalid input: expected ${expected}, received ${inputType}`;
}

/**
 * @private
 */
function getBoundSchema<T extends ZodType>(bound: Bound<unknown>, schema: T) {
	return bound instanceof BoundIncluded
		? BoundIncludedSchema(schema)
		: bound instanceof BoundExcluded
			? BoundExcludedSchema(schema)
			: ZodUndefined();
}

/**
 * @private
 */
type RecordIdValueSchema = ZodString | ZodNumber | ZodCustom<Uuid> | ZodBigInt | ZodObject | ZodArray;

// SECTION - DateTime

export const DateTimeSchema = custom<DateTime>((v) => v instanceof DateTime, {
	error: (issue) => {
		return constructErrorMessage({
			expected: "DateTime",
			input: issue.input,
		});
	},
});

// !SECTION
// SECTION - Decimal

export const DecimalSchema = custom<Decimal>((v) => v instanceof Decimal, {
	error: (issue) => {
		return constructErrorMessage({
			expected: "Decimal",
			input: issue.input,
		});
	},
});

// !SECTION
// SECTION - Duration

export const DurationSchema = custom<Duration>((v) => v instanceof Duration, {
	error: (issue) => {
		return constructErrorMessage({
			expected: "Duration",
			input: issue.input,
		});
	},
});

// !SECTION
// SECTION - File

export const FileRefSchema = custom<FileRef>((v) => v instanceof FileRef, {
	error: (issue) => {
		return constructErrorMessage({
			expected: "FileRef",
			input: issue.input,
		});
	},
});

// !SECTION
// SECTION - Future

/**
 * @deprecated Futures were removed in SurrealDB 3.0
 */
export const FutureSchema = custom<Future>((v) => v instanceof Future, {
	error: (issue) => {
		return constructErrorMessage({
			expected: "Future",
			input: issue.input,
		});
	},
});

// !SECTION
// SECTION - Geometry

export const GeometrySchema = custom<Geometry>((v) => v instanceof Geometry, {
	error: (issue) => {
		return constructErrorMessage({
			expected: "Geometry",
			input: issue.input,
		});
	},
});
export const GeometryPointSchema = custom<GeometryPoint>((v) => v instanceof GeometryPoint, {
	error: (issue) => {
		return constructErrorMessage({
			expected: "GeometryPoint",
			input: issue.input,
		});
	},
});
export const GeometryLineSchema = custom<GeometryLine>((v) => v instanceof GeometryLine, {
	error: (issue) => {
		return constructErrorMessage({
			expected: "GeometryLine",
			input: issue.input,
		});
	},
});
export const GeometryPolygonSchema = custom<GeometryPolygon>((v) => v instanceof GeometryPolygon, {
	error: (issue) => {
		return constructErrorMessage({
			expected: "GeometryPolygon",
			input: issue.input,
		});
	},
});
export const GeometryMultiPointSchema = custom<GeometryMultiPoint>((v) => v instanceof GeometryMultiPoint, {
	error: (issue) => {
		return constructErrorMessage({
			expected: "GeometryMultiPoint",
			input: issue.input,
		});
	},
});
export const GeometryMultiLineSchema = custom<GeometryMultiLine>((v) => v instanceof GeometryMultiLine, {
	error: (issue) => {
		return constructErrorMessage({
			expected: "GeometryMultiLine",
			input: issue.input,
		});
	},
});
export const GeometryMultiPolygonSchema = custom<GeometryMultiPolygon>((v) => v instanceof GeometryMultiPolygon, {
	error: (issue) => {
		return constructErrorMessage({
			expected: "GeometryMultiPolygon",
			input: issue.input,
		});
	},
});
export const GeometryCollectionSchema = custom<GeometryCollection>((v) => v instanceof GeometryCollection, {
	error: (issue) => {
		return constructErrorMessage({
			expected: "GeometryCollection",
			input: issue.input,
		});
	},
});

// !SECTION
// SECTION - Range

export function RangeSchema<Beg extends ZodType, End extends ZodType>(begValueSchema: Beg, endValueSchema: End) {
	return custom<Range<output<Beg>, output<End>>>((v) => v instanceof Range, {
		error: (issue) => {
			return constructErrorMessage({
				expected: "Range",
				input: issue.input,
			});
		},
	}).superRefine((v, ctx) => {
		const parsedBegin = getBoundSchema(v.begin, begValueSchema).safeParse(v.begin);

		if (!parsedBegin.success) {
			for (const issue of parsedBegin.error.issues) {
				ctx.addIssue({
					...issue,
					path: ["value", ...issue.path],
				});
			}
		}

		const parsedEnd = getBoundSchema(v.end, endValueSchema).safeParse(v.end);

		if (!parsedEnd.success) {
			for (const issue of parsedEnd.error.issues) {
				ctx.addIssue({
					...issue,
					path: ["value", ...issue.path],
				});
			}
		}
	});
}
export function BoundIncludedSchema<T extends ZodType>(valueSchema: T) {
	return custom<BoundIncluded<T>>((v) => v instanceof BoundIncluded, {
		error: (issue) => {
			return constructErrorMessage({
				expected: "BoundIncluded",
				input: issue.input,
			});
		},
	}).superRefine((v, ctx) => {
		const parsed = valueSchema.safeParse(v.value);

		if (parsed.success) {
			// NOTE: See https://zod.dev/api?id=transforms
			return NEVER;
		}

		for (const issue of parsed.error.issues) {
			ctx.addIssue({
				...issue,
				path: ["value", ...issue.path],
			});
		}
	});
}
export function BoundExcludedSchema<T extends ZodType>(valueSchema: T) {
	return custom<BoundExcluded<T>>((v) => v instanceof BoundExcluded, {
		error: (issue) => {
			return constructErrorMessage({
				expected: "BoundExcluded",
				input: issue.input,
			});
		},
	}).superRefine((v, ctx) => {
		const parsed = valueSchema.safeParse(v.value);

		if (parsed.success) {
			return;
		}

		for (const issue of parsed.error.issues) {
			ctx.addIssue({
				...issue,
				path: ["value", ...issue.path],
			});
		}
	});
}
export const RecordIdRangeSchema = custom<RecordIdRange>((v) => v instanceof RecordIdRange, {
	error: (issue) => {
		return constructErrorMessage({
			expected: "RecordIdRange",
			input: issue.input,
		});
	},
});
export function RecordIdRangeSchemaOf<Tb extends string, Id extends RecordIdValueSchema | undefined = undefined>(
	table: Tb,
	id?: Id,
) {
	return custom<RecordIdRange<Tb, Id extends ZodType ? output<Id> : RecordIdValue>>(
		(v) => v instanceof RecordIdRange,
		{
			error: (issue) => {
				return constructErrorMessage({
					expected: "RecordIdRange",
					input: issue.input,
				});
			},
		},
	).superRefine((v, ctx) => {
		const parsedTable = TableSchemaOf(table).safeParse(v.table);

		if (!parsedTable.success) {
			for (const issue of parsedTable.error.issues) {
				ctx.addIssue({
					...issue,
					path: ["table", ...issue.path],
				});
			}
		}

		if (id) {
			const parsedBegin = getBoundSchema(v.begin, id).safeParse(v.begin);

			if (!parsedBegin.success) {
				for (const issue of parsedBegin.error.issues) {
					ctx.addIssue({
						...issue,
						path: ["begin", ...issue.path],
					});
				}
			}

			const parsedEnd = getBoundSchema(v.end, id).safeParse(v.end);

			if (!parsedEnd.success) {
				for (const issue of parsedEnd.error.issues) {
					ctx.addIssue({
						...issue,
						path: ["end", ...issue.path],
					});
				}
			}
		}
	});
}

// !SECTION
// SECTION - RecordId

export const RecordIdSchema = custom<RecordId>((value) => value instanceof RecordId, {
	error: (issue) => {
		return constructErrorMessage({
			expected: "RecordId",
			input: issue.input,
		});
	},
});
export function RecordIdSchemaOf<Tb extends string, Id extends RecordIdValueSchema | undefined = undefined>(
	table: Tb,
	id?: Id,
) {
	return custom<RecordId<Tb, Id extends ZodType ? output<Id> : RecordIdValue>>((value) => value instanceof RecordId, {
		error: (issue) => {
			return constructErrorMessage({
				expected: "RecordId",
				input: issue.input,
			});
		},
	}).superRefine((v, ctx) => {
		const parsedTable = TableSchemaOf(table).safeParse(v.table);

		if (!parsedTable.success) {
			for (const issue of parsedTable.error.issues) {
				ctx.addIssue({
					...issue,
					path: ["table", ...issue.path],
				});
			}
		}

		if (id) {
			const parsedId = id.safeParse(v.id);

			if (!parsedId.success) {
				for (const issue of parsedId.error.issues) {
					ctx.addIssue({
						...issue,
						path: ["table", ...issue.path],
					});
				}
			}
		}
	});
}
export const StringRecordIdSchema = custom<StringRecordId>((value) => value instanceof StringRecordId, {
	error: (issue) => {
		return constructErrorMessage({
			expected: "StringRecordId",
			input: issue.input,
		});
	},
});

// SECTION - helpers

export const RecordSchema = object({
	id: RecordIdSchema,
});
export function RecordSchemaOf<Tb extends string, Id extends RecordIdValueSchema | undefined = undefined>(
	table: Tb,
	id?: Id,
) {
	return object({
		id: RecordIdSchemaOf<Tb, Id>(table, id),
	});
}

// !SECTION
// !SECTION
// SECTION - Table

export const TableSchema = custom<Table>((v) => v instanceof Table, {
	error: (issue) => {
		return constructErrorMessage({
			expected: "Table",
			input: issue.input,
		});
	},
});
export function TableSchemaOf<Tb extends string>(table: Tb) {
	return custom<Table<Tb>>((v) => v instanceof Table, {
		error: (issue) => {
			return constructErrorMessage({
				expected: "Table",
				input: issue.input,
			});
		},
	}).superRefine((v, ctx) => {
		if (v.name !== table) {
			ctx.addIssue({
				code: "invalid_value",
				values: [table],
				input: v.name,
				path: ["name"],
			});
		}
	});
}

// !SECTION
// SECTION - Uuid

export const UuidSchema = custom<Uuid>((v) => v instanceof Uuid, {
	error: (issue) => {
		return constructErrorMessage({
			expected: "Uuid",
			input: issue.input,
		});
	},
});

// !SECTION
// SECTION - Types of Helpers
// SECTION - RecordId

export type Record = output<typeof RecordSchema>;
export type RecordOf<Tb extends string = string, Id extends RecordIdValue = RecordIdValue> = {
	id: RecordId<Tb, Id>;
};

// !SECTION
// !SECTION
