fn main() {
    #[cfg(windows)]
    let attributes = {
        let windows = tauri_build::WindowsAttributes::new().app_manifest(
            r#"
<assembly xmlns="urn:schemas-microsoft-com:asm.v1" manifestVersion="1.0">
  <dependency>
    <dependentAssembly>
      <assemblyIdentity
        type="win32"
        name="Microsoft.Windows.Common-Controls"
        version="6.0.0.0"
        processorArchitecture="*"
        publicKeyToken="6595b64144ccf1df"
        language="*"
      />
    </dependentAssembly>
  </dependency>
  <trustInfo xmlns="urn:schemas-microsoft-com:asm.v3">
    <security>
      <requestedPrivileges>
        <requestedExecutionLevel level="requireAdministrator" uiAccess="false" />
      </requestedPrivileges>
    </security>
  </trustInfo>
</assembly>
"#,
        );
        tauri_build::Attributes::new().windows_attributes(windows)
    };

    #[cfg(not(windows))]
    let attributes = tauri_build::Attributes::new();

    tauri_build::try_build(attributes).expect("failed to run tauri-build");
}
