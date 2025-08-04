import {
	type Bound,
	BoundExcluded,
	BoundIncluded,
	Decimal,
	Duration,
	Future,
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
	StringRecordId,
	Table,
	Uuid,
} from "surrealdb";
import { custom, type infer as Infer, NEVER, object, string, type ZodType, undefined as ZodUndefined } from "zod";

// SECTION - Decimal

export const DecimalSchema = custom<Decimal>((v) => v instanceof Decimal, "Value is not a valid Decimal");

// !SECTION
// SECTION - Duration

export const DurationSchema = custom<Duration>((v) => v instanceof Duration, "Value is not a valid Duration");

// !SECTION
// SECTION - Future

export const FutureSchema = custom<Future>((v) => v instanceof Future, "Value is not a valid Future");

// !SECTION
// SECTION - Geometry

export const GeometryPointSchema = custom<GeometryPoint>(
	(v) => v instanceof GeometryPoint,
	"Value is not a valid GeometryPoint",
);
export const GeometryLineSchema = custom<GeometryLine>(
	(v) => v instanceof GeometryLine,
	"Value is not a valid GeometryLine",
);
export const GeometryPolygonSchema = custom<GeometryPolygon>(
	(v) => v instanceof GeometryPolygon,
	"Value is not a valid GeometryPolygon",
);
export const GeometryMultiPointSchema = custom<GeometryMultiPoint>(
	(v) => v instanceof GeometryMultiPoint,
	"Value is not a valid GeometryMultiPoint",
);
export const GeometryMultiLineSchema = custom<GeometryMultiLine>(
	(v) => v instanceof GeometryMultiLine,
	"Value is not a valid GeometryMultiLine",
);
export const GeometryMultiPolygonSchema = custom<GeometryMultiPolygon>(
	(v) => v instanceof GeometryMultiPolygon,
	"Value is not a valid GeometryPolygon",
);
export const GeometryCollectionSchema = custom<GeometryCollection>(
	(v) => v instanceof GeometryCollection,
	"Value is not a valid GeometryCollection",
);

// !SECTION
// SECTION - Range

export function RangeSchema<Beg extends ZodType, End extends ZodType>(begValueSchema: Beg, endValueSchema: End) {
	const getBoundSchema = (bound: Bound<unknown>, schema: Beg | End) => {
		return bound instanceof BoundIncluded
			? BoundIncludedSchema(schema)
			: bound instanceof BoundExcluded
				? BoundExcludedSchema(schema)
				: ZodUndefined();
	};

	return custom<Range<Infer<Beg>, Infer<End>>>((v) => v instanceof Range, "Value is not a valid Range").superRefine(
		(v, ctx) => {
			const parsedBeg = getBoundSchema(v.beg, begValueSchema).safeParse(v.beg);

			if (!parsedBeg.success) {
				for (const issue of parsedBeg.error.issues) {
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
		},
	);
}
export function BoundIncludedSchema<T extends ZodType>(valueSchema: T) {
	return custom<BoundIncluded<T>>((v) => v instanceof BoundIncluded, "Value is not a valid BoundIncluded").superRefine(
		(v, ctx) => {
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
		},
	);
}
export function BoundExcludedSchema<T extends ZodType>(valueSchema: T) {
	return custom<BoundExcluded<T>>((v) => v instanceof BoundExcluded, "Value is not a valid BoundIncluded").superRefine(
		(v, ctx) => {
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
		},
	);
}
export const RecordIdRangeSchema = custom<RecordIdRange>(
	(v) => v instanceof RecordIdRange,
	"Value is not a valid RecordIdRange",
);
export function RecordIdRangeSchemaOf<Tb extends string>(table: Tb) {
	string().parse(table);

	return custom<RecordIdRange<Tb>>(
		(v) => v instanceof RecordIdRange && v.tb === table,
		`Value is not a valid RecordIdRange or is not from table: ${table}`,
	);
}

// !SECTION
// SECTION - RecordId

export const RecordIdSchema = custom<RecordId>((value) => value instanceof RecordId, "Value is not a valid RecordId");
export function RecordIdSchemaOf<Tb extends string>(table: Tb) {
	string().parse(table);

	return custom<RecordId<Tb>>(
		(value) => value instanceof RecordId && value.tb === table,
		`Value is not a valid RecordId or is not from table: ${table}`,
	);
}
export const StringRecordIdSchema = custom<StringRecordId>(
	(value) => value instanceof StringRecordId,
	"Value is not a valid StringRecordId",
);

// SECTION - helpers

export const RecordSchema = object({
	id: RecordIdSchema,
});
export function RecordSchemaOf<Tb extends string>(table: Tb) {
	return object({
		id: RecordIdSchemaOf(table),
	});
}

// !SECTION
// !SECTION
// SECTION - Table

export const TableSchema = custom<Table>((v) => v instanceof Table, "Value is not a valid Table");
export function TableSchemaOf<Tb extends string>(table: Tb) {
	string().parse(table);

	return custom<Table<Tb>>(
		(v) => v instanceof Table && v.tb === table,
		`Value is not a valid Table or is not from table: ${table}`,
	);
}

// !SECTION
// SECTION - Uuid

export const UuidSchema = custom<Uuid>((v) => v instanceof Uuid, "Value is not a valid Uuid");

// !SECTION
// SECTION - Types of Helpers
// SECTION - RecordId

export type Record = Infer<typeof RecordSchema>;
export type RecordOf<Tb extends string = string> = Infer<ReturnType<typeof RecordSchemaOf<Tb>>>;

// !SECTION
// !SECTION
