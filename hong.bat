cd /d E:\git\testgg
"C:\Program Files (x86)\Git\bin\git.exe" status
"C:\Program Files (x86)\Git\bin\git.exe" add -A
"C:\Program Files (x86)\Git\bin\git.exe" status
"C:\Program Files (x86)\Git\bin\git.exe" commit -m "in myprocess update"
"C:\Program Files (x86)\Git\bin\git.exe" remote rm origin
"C:\Program Files (x86)\Git\bin\git.exe" remote add origin https://yaotw718:67609039ok@github.com/yaotw718/testgg.git
"C:\Program Files (x86)\Git\bin\git.exe" push origin master