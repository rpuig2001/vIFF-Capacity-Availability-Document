# CAD - Capacity Availability Document for the CDM Plugin

More information about the CDM And ATFCM projects can be found on the [WEBSITE](https://vats.im/cdm)

<br>

# How Do I Submit or update My Data?

All contributions from vACC staff are welcome!

1. Fork the repository.
2. Make your changes in data/<your FIR/vACC directory> (or create it if it doesn't exist).
3. Validate your changes using the provided JSON schemas or the vacs-data tool.
4. Submit a Pull Request.
   
  **Please, check already submitted examples before send the request.**

<br>

# Which Is The Format?
airblocks.geojson (NOT REQUIRED IF USING VATGLASSES):
  - Here volumes are included to later use them as sectors. To pass the vatglasses data into the required form, it is possible by using this converter: [VATGLASSES-CDM-CONVERTER](https://cdm.vatsimspain.es/vatglasses-to-cdm)
  - MinFL, MaxFL and capacity are a must to have correctly defined airspaces.
  - Lateral limits should be defined as Multipolygon (Like Vatspy data).
  - To check data by vertical limits, the following website is created (Data from the main branch is used): [AIRSPACES-MAP](https://cdm.vatsimspain.es/airspaces-map.html)
  - ID must be UPPERCASE and must include the first two letter of the FIR. Example for Spain: "LE-airblockName".

procedures.txt
  - Format ``<AIRPORT>:SID:<letters or procedures name>:STAR:<letters or procedures name>`` example: ``LEBL:SID:SENIA%Q,LARPA%Q,T:STAR:BISBA%W,LESBA%W,Z,Q``
    - AIRPORT: ICAO code.
    - letters: last letter of SID/STAR, set all the valid letters. Empty if all are valid.
    - (OPTIONAL) Runway or config designator can be added at the end of each procedure (Example: P/25,SPESA%C/WEST,SPESA%C/TEST, etc.) - Note: If designator is selected in the Dashboard Data maintenance, the system will only look for the procedures for the specified runway.
  - The decision of which procedure to choose will be:
    - If pilot filed SID/STAR is in the valid list, then it will selected.
    - If pilot does not file a SID/STAR, the first in the list is chosen (order is by given in letters).
  - If any can be selected, then direct path will be created.

profile_restrictions.txt (NOT REQUIRED ANYMORE. Maintenance or PTR in vIFF Dashboard)

  Remark: it will only be respected, if RFL is at or above.
  Remark: This will override SID/STAR ALT restrictions.
