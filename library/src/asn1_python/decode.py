

import asn1tools
import sys
import binascii
import json

asn1_file = sys.argv[1]
hex_file = sys.argv[2]
out_file = sys.argv[3]
attribute_name = sys.argv[4]

asn1Schema = asn1tools.compile_files(asn1_file)

with open(hex_file, 'r') as f:
    data = f.read()
# print(data)
hex_data = bytearray.fromhex(data)
# hex_data = data

decoded_data = asn1Schema.decode(attribute_name, hex_data)

for key in decoded_data:
    if isinstance(decoded_data[key], (bytes, bytearray)):
        decoded_data[key] = list(decoded_data[key])

print(decoded_data);
with open(out_file, "w") as json_out:
    json.dump(decoded_data, json_out)
