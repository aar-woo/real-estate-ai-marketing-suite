import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const zip = searchParams.get("zip");
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const address = searchParams.get("address");

    const radiusParam = searchParams.get("radius");
    const radius = radiusParam ? parseInt(radiusParam) : 5;

    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : 6;

    const schoolType = searchParams.get("type");
    const gradeLevel = searchParams.get("grade");

    if (!zip && !city && !state && !address) {
      return NextResponse.json(
        {
          error:
            "At least one location parameter is required (zip, city, state, or address)",
        },
        { status: 400 }
      );
    }

    if (radiusParam && (isNaN(radius) || radius < 1 || radius > 50)) {
      return NextResponse.json(
        { error: "Radius must be a number between 1 and 50 miles" },
        { status: 400 }
      );
    }

    if (limitParam && (isNaN(limit) || limit < 1 || limit > 25)) {
      return NextResponse.json(
        { error: "Limit must be a number between 1 and 25" },
        { status: 400 }
      );
    }

    const apiKey = process.env.SCHOOLDIGGER_API_KEY;
    const appId = process.env.SCHOOLDIGGER_APP_ID;

    if (!apiKey) {
      return NextResponse.json(
        { error: "SchoolDigger API key not configured" },
        { status: 500 }
      );
    }

    if (!appId) {
      return NextResponse.json(
        { error: "SchoolDigger App ID not configured" },
        { status: 500 }
      );
    }

    const apiSearchParams: Record<string, string> = {
      appID: appId,
      appKey: apiKey,
      ...(state && { st: state }),
      ...(city && { city }),
      ...(zip && { zip }),
      ...(address && { address }),
      ...(radius && { radius: radius.toString() }),
      ...(limit && { limit: limit.toString() }),
      ...(schoolType && { type: schoolType }),
      ...(gradeLevel && { level: gradeLevel }),
    };

    const queryString = Object.entries(apiSearchParams)
      .filter(([_, value]) => value !== "")
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const apiUrl = `https://api.schooldigger.com/v2.3/schools?${queryString}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SchoolDigger API error:", response.status, errorText);

      if (response.status === 404) {
        return NextResponse.json(
          { error: "No schools found for the specified location" },
          { status: 404 }
        );
      }

      if (response.status === 401) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
      }

      return NextResponse.json(
        {
          error: "Failed to fetch schools from SchoolDigger API",
          status: response.status,
          details: errorText,
        },
        { status: response.status }
      );
    }

    interface SchoolData {
      schoolid: string;
      schoolName: string;
      phone?: string;
      url?: string;
      address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        latLong?: {
          latitude: number;
          longitude: number;
        };
      };
      district?: {
        districtID?: string;
        districtName?: string;
        url?: string;
      };
      schoolLevel?: string;
      isPrivate?: boolean;
      isCharterSchool?: string;
      isMagnetSchool?: string;
      isVirtualSchool?: string;
      lowGrade?: string;
      highGrade?: string;
      schoolYearlyDetails?: Array<{
        year?: number;
        averageStandardScore?: number;
        schoolRanking?: {
          rank?: number;
          rankOf?: number;
        };
        numberOfStudents?: number;
        pupilTeacherRatio?: number;
        percentFreeDiscLunch?: number;
        percentofAfricanAmericanStudents?: number;
        percentofAsianStudents?: number;
        percentofHispanicStudents?: number;
        percentofWhiteStudents?: number;
        teachersFulltime?: number;
      }>;
      rankHistory?: Array<{
        year?: number;
        rank?: number;
        rankOf?: number;
      }>;
      testScores?: unknown[];
      chronicAbsenteeismRates?: unknown[];
      rankMovement?: number;
      finance?: unknown[];
    }

    const data: {
      schoolList?: SchoolData[];
      numberOfSchools?: number;
      numberOfPages?: number;
    } = await response.json();

    const transformedSchools =
      data.schoolList?.map((school) => ({
        id: school.schoolid,
        name: school.schoolName,
        phone: school.phone,
        website: school.url,
        address: {
          street: school.address?.street || "",
          city: school.address?.city || "",
          state: school.address?.state || "",
          zip: school.address?.zip || "",
          coordinates: school.address?.latLong
            ? {
                lat: school.address.latLong.latitude,
                lng: school.address.latLong.longitude,
              }
            : null,
        },
        district: {
          id: school.district?.districtID || "",
          name: school.district?.districtName || "",
          website: school.district?.url || "",
        },
        schoolLevel: school.schoolLevel || "",
        isPrivate: school.isPrivate || false,
        isCharter: school.isCharterSchool === "Yes",
        isMagnet: school.isMagnetSchool === "Yes",
        isVirtual: school.isVirtualSchool === "Yes",
        grades: {
          low: school.lowGrade || "",
          high: school.highGrade || "",
        },
        enrollment: {
          total: school.schoolYearlyDetails?.[0]?.numberOfStudents || 0,
          studentTeacherRatio:
            school.schoolYearlyDetails?.[0]?.pupilTeacherRatio || 0,
          freeLunch: school.schoolYearlyDetails?.[0]?.percentFreeDiscLunch || 0,
        },
        performance: {
          rankHistory: school.rankHistory || [],
          testScores: school.testScores || [],
          chronicAbsenteeism: school.chronicAbsenteeismRates || [],
          rankMovement: school.rankMovement || 0,
        },
        finance: school.finance || [],
        demographics: school.schoolYearlyDetails?.[0]
          ? {
              year: school.schoolYearlyDetails[0].year,
              totalStudents: school.schoolYearlyDetails[0].numberOfStudents,
              percentFreeLunch:
                school.schoolYearlyDetails[0].percentFreeDiscLunch,
              percentAfricanAmerican:
                school.schoolYearlyDetails[0].percentofAfricanAmericanStudents,
              percentAsian:
                school.schoolYearlyDetails[0].percentofAsianStudents,
              percentHispanic:
                school.schoolYearlyDetails[0].percentofHispanicStudents,
              percentWhite:
                school.schoolYearlyDetails[0].percentofWhiteStudents,
              teachersFulltime: school.schoolYearlyDetails[0].teachersFulltime,
              pupilTeacherRatio:
                school.schoolYearlyDetails[0].pupilTeacherRatio,
            }
          : null,
      })) || [];

    return NextResponse.json({
      success: true,
      schools: transformedSchools,
      total_count: data.numberOfSchools || transformedSchools.length,
      search_params: {
        zip,
        city,
        state,
        address,
        radius_miles: radius,
        limit,
        schoolType,
        gradeLevel,
      },
      pagination: {
        current_page: 1,
        total_pages: data.numberOfPages || 1,
        has_more: (data.numberOfPages || 1) > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch schools",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
