@app.get("/docMetaInfo")
async def get_doc_meta_info():
    try:
        # Read existing JSON data or initialize empty list
        data = []
        if JSON_FILE.exists():
            with JSON_FILE.open("r") as f:
                data = json.load(f)

        # Initialize globalRMInfo dictionary
        globalRMInfo = {}

        # Process metaInfo for each object
        for object_id, obj in enumerate(data):
            meta_info = obj.get("metaInfo", {})
            for key, values in meta_info.items():
                for value in values:
                    # Split value based on "."
                    if "." in value:
                        auxkey, val = value.split(".", 1)
                        dict_key = f"{object_id}-{auxkey}"
                        if dict_key not in globalRMInfo:
                            globalRMInfo[dict_key] = []
                        globalRMInfo[dict_key].append(val)

        # Transform data into the requested format
        result = []
        today = datetime.now().strftime("%Y-%m-%d")
        for index, obj in enumerate(data):
            # Split version into major and minor
            version = obj.get("version", "0.0")
            major_version, minor_version = version.split(".") if "." in version else (version, "0")

            # Get template_type from globalRMInfo
            template_type_key = f"{index}-validationtype"
            template_type = globalRMInfo.get(template_type_key, ["unknown"])[0]

            result.append({
                "id": index,
                "row_id": index,
                "major_version": major_version,
                "minor_version": minor_version,
                "name": obj.get("name", ""),
                "description": obj.get("description", ""),
                "template_type": template_type,
                "status": "draft",
                "created_at": today,
                "user_id": 811,
                "deprecated": False,
                "visibility": "public",
                "permissions": "public",
                "updated_at": today,
                "tags": [],
                "username": "god",
                "fullname": "krishn kanahiya"
            })

        # Return response in the specified format
        return JSONResponse(
            status_code=200,
            content={
                "data": {
                    "result": result,
                    "total_count": len(result)
                }
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
