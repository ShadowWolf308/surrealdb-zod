import { Bound, BoundExcluded, BoundIncluded, Decimal, Duration, Future, GeometryCollection, GeometryLine, GeometryMultiLine, GeometryMultiPoint, GeometryMultiPolygon, GeometryPoint, GeometryPolygon, Range, RecordId, RecordIdRange, StringRecordId, Table, Uuid } from "surrealdb";
import { z } from "zod";
// SECTION - Decimal

export const DecimalSchema = z.custom<Decimal>((v) => v instanceof Decimal, "Value is not a valid Decimal", true);

// !SECTION
// SECTION - Duration

export const DurationSchema = z.custom<Duration>((v) => v instanceof Duration, "Value is not a valid Duration", true);

// !SECTION
// SECTION - Future

export const FutureSchema = z.custom<Future>((v) => v instanceof Future, "Value is not a valid Future", true);

// !SECTION
// SECTION - Geometry

export const GeometryPointSchema = z.custom<GeometryPoint>((v) => v instanceof GeometryPoint, "Value is not a valid GeometryPoint", true);
export const GeometryLineSchema = z.custom<GeometryLine>((v) => v instanceof GeometryLine, "Value is not a valid GeometryLine", true);
export const GeometryPolygonSchema = z.custom<GeometryPolygon>((v) => v instanceof GeometryPolygon, "Value is not a valid GeometryPolygon", true);
export const GeometryMultiPointSchema = z.custom<GeometryMultiPoint>((v) => v instanceof GeometryMultiPoint, "Value is not a valid GeometryMultiPoint", true);
export const GeometryMultiLineSchema = z.custom<GeometryMultiLine>((v) => v instanceof GeometryMultiLine, "Value is not a valid GeometryMultiLine", true);
export const GeometryMultiPolygonSchema = z.custom<GeometryMultiPolygon>((v) => v instanceof GeometryMultiPolygon, "Value is not a valid GeometryPolygon", true);
export const GeometryCollectionSchema = z.custom<GeometryCollection>((v) => v instanceof GeometryCollection, "Value is not a valid GeometryCollection", true);

// !SECTION
// SECTION - Range

export function RangeSchema<Beg  extends z.ZodAny, End  extends z.ZodAny>(begValueSchema: Beg, endValueSchema: End) {
	const getBoundSchema = (bound: Bound<unknown>, schema: Beg | End) => {
		return bound instanceof BoundIncluded ? BoundIncludedSchema(schema) : (bound instanceof BoundExcluded ? BoundExcludedSchema(schema) : z.undefined());
	}

	return z.custom<Range<z.infer<Beg>, z.infer<End>>>(
		(v) => v instanceof Range,
		"Value is not a valid Range",
		true,
	)
		.superRefine(
			(v, ctx) => {
				const parsedBeg = getBoundSchema(v.beg, begValueSchema).safeParse(v.beg);

				if (!parsedBeg.success) {
					for (const issue of parsedBeg.error.issues) {
						ctx.addIssue({
							...issue,
							path: [...ctx.path, "value", ...issue.path],
						});
					}
				}

				const parsedEnd = getBoundSchema(v.end, endValueSchema).safeParse(v.end);

				if (!parsedEnd.success) {
					for (const issue of parsedEnd.error.issues) {
						ctx.addIssue({
							...issue,
							path: [...ctx.path, "value", ...issue.path],
						});
					}
				}
			},
		);
}
export function BoundIncludedSchema<T extends z.ZodAny>(valueSchema: T) {
	return z.custom<BoundIncluded<T>>(
		(v) => v instanceof BoundIncluded,
		"Value is not a valid BoundIncluded",
		true,
	)
		.superRefine(
			(v, ctx) => {
				const parsed = valueSchema.safeParse(v.value);

				if (parsed.success) {
					// NOTE: See https://zod.dev/?id=abort-early
					return z.NEVER;
				}

				for (const issue of parsed.error.issues) {
					ctx.addIssue({
						...issue,
						path: [...ctx.path, "value", ...issue.path],
					});
				}
			},
		);
}
export function BoundExcludedSchema<T extends z.ZodAny>(valueSchema: T) {
	return z.custom<BoundExcluded<T>>(
		(v) => v instanceof BoundExcluded,
		"Value is not a valid BoundIncluded",
		true,
	)
		.superRefine(
			(v, ctx) => {
				const parsed = valueSchema.safeParse(v.value);

				if (parsed.success) {
					return;
				}

				for (const issue of parsed.error.issues) {
					ctx.addIssue({
						...issue,
						path: [...ctx.path, "value", ...issue.path],
					});
				}
			},
		);
}
export const RecordIdRangeSchema = z.custom<RecordIdRange>((v) => v instanceof RecordIdRange, "Value is not a valid RecordIdRange", true);
export function RecordIdRangeSchemaOf<Tb extends string>(table: Tb) {
	z.string().parse(table);

	return z.custom<RecordIdRange<Tb>>(
		(v) => v instanceof RecordIdRange && v.tb === table,
		`Value is not a valid RecordIdRange or is not from table: ${table}`,
		true,
	);
}

// !SECTION
// SECTION - RecordId

export const RecordIdSchema = z.custom<RecordId>((value) => value instanceof RecordId, "Value is not a valid RecordId", true);
export function RecordIdSchemaOf<Tb extends string>(table: Tb) {
	z.string().parse(table);

	return z.custom<RecordId<Tb>>(
		(value) => value instanceof RecordId && value.tb === table,
		`Value is not a valid RecordId or is not from table: ${table}`,
		true,
	);
}
export const StringRecordIdSchema = z.custom<StringRecordId>((value) => value instanceof StringRecordId, "Value is not a valid StringRecordId", true);

// SECTION - helpers

export const RecordSchema = z.object({
	id: RecordIdSchema,
});
export function RecordSchemaOf<Tb extends string>(table: Tb) {
	return z.object({
		id: RecordIdSchemaOf(table),
	});
}

// !SECTION
// !SECTION
// SECTION - Table

export const TableSchema = z.custom<Table>((v) => v instanceof Table, "Value is not a valid Table", true);
export function TableSchemaOf<Tb extends string>(table: Tb) {
	z.string().parse(table);

	return z.custom<Table<Tb>>(
		(v) => v instanceof Table && v.tb === table,
		`Value is not a valid Table or is not from table: ${table}`,
		true,
	);
}

// !SECTION
// SECTION - Uuid

export const UUIDSchema = z.custom<Uuid>((v) => v instanceof Uuid, "Value is not a valid Uuid", true);

// !SECTION
// SECTION - Types of Helperes
// SECTION - RecordId

export type Record = z.infer<typeof RecordSchema>;
export type RecordOf<Tb extends string = string> = z.infer<ReturnType<typeof RecordSchemaOf<Tb>>>;

// !SECTION
// !SECTION